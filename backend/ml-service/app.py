"""
AniResQ ML Service - YOLOv8 Object Detection for CCTV Monitoring
Processes live CCTV feeds and sends detections to the backend API
"""

import cv2
import numpy as np
import requests
import logging
from ultralytics import YOLO
from pathlib import Path
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv
from collections import defaultdict, deque
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MLService:
    def __init__(self, model_path, backend_url, confidence_threshold=0.5):
        """
        Initialize ML Service

        Args:
            model_path: Path to YOLOv8 model file
            backend_url: Backend API URL for posting detections
            confidence_threshold: Minimum confidence score for detections
        """
        self.model_path = model_path
        self.backend_url = backend_url
        self.confidence_threshold = confidence_threshold

        # Load YOLOv8 model
        try:
            logger.info(f"Loading YOLOv8 model from {model_path}")
            self.model = YOLO(model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

        # Track recent detections to avoid duplicates
        self.detection_cache = defaultdict(list)  # {cctv_id: [(timestamp, detections)]}
        self.cache_expiry_seconds = 30  # Keep detections for 30 seconds
        # Frame buffer to capture short clips on detection
        clip_frames = int(os.getenv('CLIP_FRAMES', 30))
        self.frame_buffer = deque(maxlen=clip_frames)

    def process_frame(self, frame):
        """
        Run YOLOv8 inference on a frame

        Args:
            frame: Input frame (numpy array)

        Returns:
            dict: Contains detected objects with class names, confidence, bounding boxes
        """
        try:
            # Run inference
            results = self.model(frame, conf=self.confidence_threshold)

            detections = {
                'objects': [],
                'raw_results': results
            }

            # Extract detection information
            if results and results[0].boxes:
                for box in results[0].boxes:
                    detection = {
                        'class_id': int(box.cls[0]),
                        'class_name': self.model.names[int(box.cls[0])],
                        'confidence': float(box.conf[0]),
                        'bbox': {
                            'x_min': float(box.xyxy[0][0]),
                            'y_min': float(box.xyxy[0][1]),
                            'x_max': float(box.xyxy[0][2]),
                            'y_max': float(box.xyxy[0][3])
                        }
                    }
                    detections['objects'].append(detection)

            return detections

        except Exception as e:
            logger.error(f"Error during inference: {e}")
            return {'objects': [], 'error': str(e)}

    def should_send_alert(self, cctv_id, detections):
        """
        Determine if an alert should be sent based on detections and timing

        Args:
            cctv_id: ID of the CCTV camera
            detections: List of detected objects

        Returns:
            bool: True if alert should be sent
        """
        current_time = datetime.now()

        # Clean expired cache entries
        if cctv_id in self.detection_cache:
            self.detection_cache[cctv_id] = [
                (ts, det) for ts, det in self.detection_cache[cctv_id]
                if (current_time - ts).total_seconds() < self.cache_expiry_seconds
            ]

        # If no detections, don't send alert
        if not detections:
            return False

        # Don't send alert if same detection was sent recently
        if cctv_id in self.detection_cache and self.detection_cache[cctv_id]:
            return False

        return True

    def send_detection_to_backend(self, cctv_id, detections, frame_shape=None, video_path=None):
        """
        Send detection results to backend API

        Args:
            cctv_id: CCTV Camera ID
            detections: Dictionary containing detected objects
            frame_shape: Tuple of (height, width) for frame
            video_path: Optional path to video clip file to upload

        Returns:
            bool: True if successfully sent
        """
        try:
            # If video provided, send as multipart/form-data, else use JSON
            if video_path and os.path.exists(video_path):
                with open(video_path, 'rb') as f:
                    files = {'video': f}
                    data = {
                        'cctv_id': cctv_id,
                        'timestamp': datetime.now().isoformat(),
                        'detections': json.dumps(detections['objects']),
                        'total_detections': len(detections['objects']),
                        'frame_shape': json.dumps(frame_shape) if frame_shape else None,
                    }
                    response = requests.post(
                        f"{self.backend_url}/api/detections",
                        files=files,
                        data=data,
                        timeout=30
                    )
            else:
                payload = {
                    'cctv_id': cctv_id,
                    'timestamp': datetime.now().isoformat(),
                    'detections': detections['objects'],
                    'total_detections': len(detections['objects']),
                    'frame_shape': frame_shape
                }
                response = requests.post(
                    f"{self.backend_url}/api/detections",
                    json=payload,
                    timeout=5
                )

            if response.status_code == 201:
                logger.info(f"Detection sent successfully for CCTV {cctv_id}")
                # Cache the detection
                self.detection_cache[cctv_id].append((datetime.now(), detections['objects']))
                return True
            else:
                logger.warning(f"Backend returned status {response.status_code}: {response.text}")
                return False

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to send detection to backend: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending detection: {e}")
            return False

    def process_cctv_stream(self, cctv_id, stream_url, fps=1):
        """
        Process a CCTV stream continuously

        Args:
            cctv_id: Unique ID for this CCTV camera
            stream_url: URL of the CCTV stream (RTSP, HTTP, etc.)
            fps: Frames per second to process (1 = process 1 frame per second)
        """
        logger.info(f"Starting stream processing for CCTV {cctv_id}: {stream_url}")

        try:
            cap = cv2.VideoCapture(stream_url)

            if not cap.isOpened():
                logger.error(f"Failed to open stream: {stream_url}")
                return

            frame_count = 0
            process_interval = int(cap.get(cv2.CAP_PROP_FPS) / fps) if fps > 0 else 1

            while True:
                ret, frame = cap.read()

                if not ret:
                    logger.warning(f"Failed to read frame from CCTV {cctv_id}, reconnecting...")
                    cap.release()
                    time.sleep(5)
                    cap = cv2.VideoCapture(stream_url)
                    continue

                frame_count += 1

                # keep frame in buffer for potential short-clip saving
                try:
                    self.frame_buffer.append(frame)
                except Exception:
                    pass

                # Process frame at specified FPS
                if frame_count % process_interval == 0:
                    # Resize frame for faster processing
                    frame_resized = cv2.resize(frame, (640, 480))

                    # Run inference
                    detections = self.process_frame(frame_resized)

                    # Filter out humans - only alert for animals
                    animal_detections = [d for d in detections.get('objects', []) if d.get('class_name', '').lower() not in ('human', 'humans')]

                    if animal_detections:
                        # Print terminal alerts with class and confidence
                        for d in animal_detections:
                            logger.warning(f"ALERT: {d.get('class_name')} - Confidence: {d.get('confidence'):.2f}")

                    # Check if alert should be sent (use animal-only list)
                    if self.should_send_alert(cctv_id, animal_detections):
                        # create short clip from frame buffer (if available)
                        video_path = None
                        try:
                            if len(self.frame_buffer) > 0:
                                tmp_dir = os.getenv('TMPDIR', '/tmp')
                                tmp_path = os.path.join(tmp_dir, f"detection_{cctv_id}_{int(time.time())}.mp4")
                                height, width = frame_resized.shape[:2]
                                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                                out = cv2.VideoWriter(tmp_path, fourcc, 10.0, (width, height))
                                for f in list(self.frame_buffer):
                                    try:
                                        f_resized = cv2.resize(f, (width, height))
                                        out.write(f_resized)
                                    except Exception:
                                        pass
                                out.release()
                                video_path = tmp_path
                        except Exception as e:
                            logger.error(f"Error creating clip: {e}")

                        # Attach only animal detections when sending
                        send_detections = {'objects': animal_detections, 'raw_results': detections.get('raw_results')}

                        sent = self.send_detection_to_backend(
                            cctv_id,
                            send_detections,
                            frame_shape=frame_resized.shape,
                            video_path=video_path
                        )

                        # cleanup temp video if created
                        try:
                            if video_path and os.path.exists(video_path):
                                os.remove(video_path)
                        except Exception:
                            pass

                        if sent:
                            logger.info(f"Alert sent: {len(send_detections['objects'])} objects detected")

        except Exception as e:
            logger.error(f"Error processing stream {cctv_id}: {e}")
        finally:
            cap.release()
            logger.info(f"Stream processing stopped for CCTV {cctv_id}")

def main():
    """Main entry point"""
    # Configuration from environment variables
    model_path = os.getenv('MODEL_PATH', 'yolov8n.pt')
    backend_url = os.getenv('BACKEND_URL', 'http://localhost:3000')
    confidence_threshold = float(os.getenv('CONFIDENCE_THRESHOLD', 0.5))

    logger.info("AniResQ ML Service Started")
    logger.info(f"Backend URL: {backend_url}")
    logger.info(f"Model Path: {model_path}")
    logger.info(f"Confidence Threshold: {confidence_threshold}")

    # Initialize ML Service
    service = MLService(model_path, backend_url, confidence_threshold)

    # Example: Process a single CCTV stream
    # In production, this would be managed by the backend API
    cctv_id = "cctv_001"
    stream_url = os.getenv('CCTV_STREAM_URL', 'rtsp://localhost/stream')

    # Start processing (this runs indefinitely)
    service.process_cctv_stream(cctv_id, stream_url, fps=1)

if __name__ == "__main__":
    main()
