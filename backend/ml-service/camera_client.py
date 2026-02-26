"""
AniResQ Camera Testing Script
Captures video from laptop camera and sends frames to ML service
"""

import cv2
import requests
import logging
import base64
import time
import threading
from datetime import datetime
import sys

# Configure logging with colors
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

class CameraDetectionClient:
    def __init__(self, ml_service_url='http://localhost:5000', camera_index=0):
        self.ml_service_url = ml_service_url
        self.camera_index = camera_index
        self.cap = None
        self.running = False
        self.frame_count = 0
        self.detection_count = 0

    def connect_camera(self):
        """Initialize camera connection"""
        try:
            logger.info(f"📹 Attempting to connect to camera (index: {self.camera_index})...")
            self.cap = cv2.VideoCapture(self.camera_index)

            if not self.cap.isOpened():
                logger.error(f"❌ Failed to open camera (index: {self.camera_index})")
                return False

            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_FPS, 30)

            logger.info("✅ Camera connected successfully!")
            return True

        except Exception as e:
            logger.error(f"❌ Camera connection error: {e}")
            return False

    def frame_to_base64(self, frame):
        """Convert frame to base64"""
        try:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            return frame_base64
        except Exception as e:
            logger.error(f"❌ Error encoding frame: {e}")
            return None

    def send_frame_to_ml(self, frame_base64, confidence=0.5):
        """Send frame to ML service for detection"""
        try:
            payload = {
                'frame': f'data:image/jpeg;base64,{frame_base64}',
                'confidence': confidence
            }

            response = requests.post(
                f'{self.ml_service_url}/api/detect/frame',
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"❌ ML Service error: {response.status_code}")
                return None

        except requests.exceptions.Timeout:
            logger.error("❌ ML Service request timeout")
            return None
        except requests.exceptions.ConnectionError:
            logger.error(f"❌ Cannot connect to ML Service at {self.ml_service_url}")
            return None
        except Exception as e:
            logger.error(f"❌ Error sending frame: {e}")
            return None

    def process_detection_result(self, result):
        """Process and display detection results"""
        if not result or not result.get('success'):
            return

        detections = result.get('detections', [])

        if detections:
            self.detection_count += len(detections)
            logger.warning(f"🚨 DETECTION ALERT!")
            logger.warning(f"   Found {len(detections)} animal(s):")

            for detection in detections:
                logger.warning(f"   🐾 {detection['class_name']} - Confidence: {detection['confidence']:.2%}")
                logger.warning(f"      BBox: x({detection['bbox']['x_min']:.0f}-{detection['bbox']['x_max']:.0f}), y({detection['bbox']['y_min']:.0f}-{detection['bbox']['y_max']:.0f})")

    def process_frames(self, duration_seconds=30, skip_frames=2, confidence=0.5):
        """Process camera frames continuously"""
        logger.info(f"🎥 Starting camera detection for {duration_seconds} seconds...")
        logger.info(f"⚙️  Settings: Skip every {skip_frames} frames, Confidence threshold: {confidence}")
        logger.info("=" * 70)

        self.running = True
        start_time = datetime.now()
        skip_counter = 0

        try:
            while self.running:
                ret, frame = self.cap.read()

                if not ret:
                    logger.error("❌ Failed to read frame from camera")
                    break

                self.frame_count += 1
                skip_counter += 1

                # Skip frames to reduce load
                if skip_counter < skip_frames:
                    continue

                skip_counter = 0

                # Resize frame for faster processing
                frame_resized = cv2.resize(frame, (640, 480))

                # Convert to base64
                frame_base64 = self.frame_to_base64(frame_resized)

                if frame_base64:
                    # Send to ML service
                    logger.info(f"📤 Frame {self.frame_count}: Sending to ML service...")
                    result = self.send_frame_to_ml(frame_base64, confidence)

                    if result:
                        self.process_detection_result(result)
                        logger.info(f"✓ Frame {self.frame_count} processed")

                # Check duration
                elapsed = (datetime.now() - start_time).total_seconds()
                if elapsed >= duration_seconds:
                    logger.info(f"✓ Duration reached ({elapsed:.1f}s)")
                    break

                # Small delay to prevent overwhelming the ML service
                time.sleep(0.5)

        except KeyboardInterrupt:
            logger.info("\n⚠️  Camera processing interrupted by user")

        finally:
            self.stop()
            self.print_summary(elapsed if 'elapsed' in locals() else 0)

    def stop(self):
        """Stop camera capture"""
        self.running = False
        if self.cap:
            self.cap.release()
        logger.info("⏹️  Camera capture stopped")

    def print_summary(self, duration):
        """Print summary statistics"""
        logger.info("=" * 70)
        logger.info("📊 DETECTION SUMMARY")
        logger.info(f"   Total frames captured: {self.frame_count}")
        logger.info(f"   Total detections: {self.detection_count}")
        logger.info(f"   Duration: {duration:.1f} seconds")
        if self.frame_count > 0:
            logger.info(f"   Average FPS: {self.frame_count / duration:.1f}")
        logger.info("=" * 70)

def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description='AniResQ Camera Detection Client')
    parser.add_argument('--ml-service', default='http://localhost:5000',
                       help='ML Service URL (default: http://localhost:5000)')
    parser.add_argument('--camera', type=int, default=0,
                       help='Camera index (default: 0 - laptop camera)')
    parser.add_argument('--duration', type=int, default=30,
                       help='Duration in seconds (default: 30)')
    parser.add_argument('--skip-frames', type=int, default=2,
                       help='Skip every N frames (default: 2)')
    parser.add_argument('--confidence', type=float, default=0.5,
                       help='Confidence threshold (default: 0.5)')

    args = parser.parse_args()

    logger.info("🚀 AniResQ Camera Detection Client")
    logger.info(f"ML Service URL: {args.ml_service}")
    logger.info(f"Camera Index: {args.camera}")

    client = CameraDetectionClient(
        ml_service_url=args.ml_service,
        camera_index=args.camera
    )

    if client.connect_camera():
        client.process_frames(
            duration_seconds=args.duration,
            skip_frames=args.skip_frames,
            confidence=args.confidence
        )
    else:
        logger.error("❌ Failed to initialize camera")
        sys.exit(1)

if __name__ == '__main__':
    main()
