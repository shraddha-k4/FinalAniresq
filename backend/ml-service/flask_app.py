"""
AniResQ ML Service - Flask API Wrapper
Provides REST endpoints for animal detection using YOLOv8
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import logging
import os
from ultralytics import YOLO
from dotenv import load_dotenv
from datetime import datetime
import base64
import io
from PIL import Image

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging with terminal output
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

# Global model instance
model = None

def load_model():
    """Load YOLOv8 model"""
    global model
    try:
        model_path = os.getenv('MODEL_PATH', './models/best (3).pt')
        logger.info(f"🔄 Loading YOLOv8 model from: {model_path}")
        model = YOLO(model_path)
        logger.info("✅ Model loaded successfully!")
        return model
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise

@app.before_request
def initialize_model():
    """Initialize model on first request"""
    global model
    if model is None:
        load_model()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'AniResQ ML Service'}), 200

@app.route('/api/detect/image', methods=['POST'])
def detect_image():
    """
    Detect animals in a single image
    Expects: multipart/form-data with 'image' field or base64 in JSON
    """
    try:
        logger.info("📸 Processing image detection request...")

        # Handle image from file upload
        if 'image' in request.files:
            file = request.files['image']
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            logger.info(f"✓ Image uploaded: {file.filename}")

        # Handle image from base64
        elif 'base64' in request.json:
            base64_data = request.json.get('base64')
            image_bytes = base64.b64decode(base64_data.split(',')[1] if ',' in base64_data else base64_data)
            image = Image.open(io.BytesIO(image_bytes))
            frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            logger.info("✓ Base64 image decoded")
        else:
            logger.error("❌ No image data provided")
            return jsonify({'error': 'No image data provided'}), 400

        # Run detection
        confidence_threshold = float(request.json.get('confidence', 0.5)) if request.json else 0.5
        results = model(frame, conf=confidence_threshold)

        detections = []
        if results and results[0].boxes:
            for box in results[0].boxes:
                detection = {
                    'class_id': int(box.cls[0]),
                    'class_name': model.names[int(box.cls[0])],
                    'confidence': float(box.conf[0]),
                    'bbox': {
                        'x_min': float(box.xyxy[0][0]),
                        'y_min': float(box.xyxy[0][1]),
                        'x_max': float(box.xyxy[0][2]),
                        'y_max': float(box.xyxy[0][3])
                    }
                }
                detections.append(detection)
                logger.info(f"🐾 Detected: {detection['class_name']} ({detection['confidence']:.2%})")

        logger.info(f"✅ Detection complete: Found {len(detections)} animal(s)")

        return jsonify({
            'success': True,
            'total_detections': len(detections),
            'detections': detections,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"❌ Error during detection: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/detect/frame', methods=['POST'])
def detect_frame():
    """
    Detect animals in a video frame
    Expects: base64 encoded frame
    """
    try:
        logger.info("🎬 Processing frame detection request...")

        data = request.json
        base64_data = data.get('frame')
        confidence_threshold = float(data.get('confidence', 0.5))

        if not base64_data:
            logger.error("❌ No frame data provided")
            return jsonify({'error': 'No frame data provided'}), 400

        # Decode frame
        frame_bytes = base64.b64decode(base64_data.split(',')[1] if ',' in base64_data else base64_data)
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            logger.error("❌ Failed to decode frame")
            return jsonify({'error': 'Failed to decode frame'}), 400

        # Run detection
        results = model(frame, conf=confidence_threshold)

        detections = []
        if results and results[0].boxes:
            for box in results[0].boxes:
                detection = {
                    'class_id': int(box.cls[0]),
                    'class_name': model.names[int(box.cls[0])],
                    'confidence': float(box.conf[0]),
                    'bbox': {
                        'x_min': float(box.xyxy[0][0]),
                        'y_min': float(box.xyxy[0][1]),
                        'x_max': float(box.xyxy[0][2]),
                        'y_max': float(box.xyxy[0][3])
                    }
                }
                detections.append(detection)
                logger.info(f"🐾 Detected: {detection['class_name']} ({detection['confidence']:.2%})")

        logger.info(f"✅ Frame processing complete: Found {len(detections)} animal(s)")

        return jsonify({
            'success': True,
            'total_detections': len(detections),
            'detections': detections,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"❌ Error processing frame: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/detect/video', methods=['POST'])
def detect_video():
    """
    Detect animals in a video file
    Expects: video file upload or video path
    """
    try:
        logger.info("🎥 Processing video detection request...")

        data = request.json or {}
        video_path = data.get('video_path')
        confidence_threshold = float(data.get('confidence', 0.5))
        sample_every_n_frames = int(data.get('sample_every_n_frames', 5))

        if not video_path:
            logger.error("❌ No video path provided")
            return jsonify({'error': 'No video path provided'}), 400

        # Check if file exists
        if not os.path.isfile(video_path):
            logger.error(f"❌ Video file not found: {video_path}")
            return jsonify({'error': f'Video file not found: {video_path}'}), 404

        logger.info(f"🔍 Processing video: {video_path}")

        # Open video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"❌ Failed to open video: {video_path}")
            return jsonify({'error': f'Failed to open video: {video_path}'}), 400

        # Get video properties
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        logger.info(f"📊 Video info - Total frames: {total_frames}, FPS: {fps}")

        all_detections = []
        frame_count = 0
        processed_frames = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            # Sample frames
            if frame_count % sample_every_n_frames == 0:
                processed_frames += 1

                # Run detection
                results = model(frame, conf=confidence_threshold)

                detections_in_frame = []
                if results and results[0].boxes:
                    for box in results[0].boxes:
                        detection = {
                            'frame': frame_count,
                            'class_id': int(box.cls[0]),
                            'class_name': model.names[int(box.cls[0])],
                            'confidence': float(box.conf[0]),
                            'bbox': {
                                'x_min': float(box.xyxy[0][0]),
                                'y_min': float(box.xyxy[0][1]),
                                'x_max': float(box.xyxy[0][2]),
                                'y_max': float(box.xyxy[0][3])
                            }
                        }
                        detections_in_frame.append(detection)
                        all_detections.append(detection)

                if detections_in_frame:
                    logger.info(f"[Frame {frame_count}] 🐾 Found {len(detections_in_frame)} animal(s)")

        cap.release()
        logger.info(f"✅ Video processing complete: {processed_frames} frames processed, {len(all_detections)} total detections")

        return jsonify({
            'success': True,
            'total_detections': len(all_detections),
            'frames_processed': processed_frames,
            'detections': all_detections,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"❌ Error processing video: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/detect/camera', methods=['POST'])
def detect_camera():
    """
    Process camera stream in real-time
    Expects: duration_seconds and sample_interval_ms
    """
    try:
        logger.info("📹 Starting camera detection...")

        data = request.json or {}
        duration_seconds = int(data.get('duration_seconds', 10))
        sample_interval_ms = int(data.get('sample_interval_ms', 500))
        confidence_threshold = float(data.get('confidence', 0.5))
        camera_index = int(data.get('camera_index', 0))

        logger.info(f"⚙️ Camera settings - Duration: {duration_seconds}s, Sample: {sample_interval_ms}ms, Confidence: {confidence_threshold}")

        # Open camera
        cap = cv2.VideoCapture(camera_index)
        if not cap.isOpened():
            logger.error(f"❌ Failed to open camera (index: {camera_index})")
            return jsonify({'error': f'Failed to open camera'}), 400

        logger.info("✓ Camera opened successfully")

        all_detections = []
        frame_count = 0
        start_time = datetime.now()

        while True:
            ret, frame = cap.read()
            if not ret:
                logger.warning("⚠️ Failed to read frame from camera")
                break

            frame_count += 1

            # Run detection
            try:
                results = model(frame, conf=confidence_threshold)

                detections_in_frame = []
                if results and results[0].boxes:
                    for box in results[0].boxes:
                        detection = {
                            'frame': frame_count,
                            'class_id': int(box.cls[0]),
                            'class_name': model.names[int(box.cls[0])],
                            'confidence': float(box.conf[0]),
                            'bbox': {
                                'x_min': float(box.xyxy[0][0]),
                                'y_min': float(box.xyxy[0][1]),
                                'x_max': float(box.xyxy[0][2]),
                                'y_max': float(box.xyxy[0][3])
                            }
                        }
                        detections_in_frame.append(detection)
                        all_detections.append(detection)

                if detections_in_frame:
                    logger.info(f"🚨 [Frame {frame_count}] ALERT: {len(detections_in_frame)} animal(s) detected!")
                    for det in detections_in_frame:
                        logger.info(f"   • {det['class_name']} ({det['confidence']:.2%})")

            except Exception as e:
                logger.error(f"❌ Detection error at frame {frame_count}: {e}")

            # Check time
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed >= duration_seconds:
                logger.info(f"✓ Duration reached ({elapsed:.1f}s)")
                break

        cap.release()
        logger.info(f"✅ Camera processing complete: {frame_count} frames, {len(all_detections)} total detections")

        return jsonify({
            'success': True,
            'total_frames': frame_count,
            'total_detections': len(all_detections),
            'detections': all_detections,
            'duration_seconds': elapsed,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"❌ Error during camera processing: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    try:
        info = {
            'model_name': 'YOLOv8',
            'model_path': os.getenv('MODEL_PATH', './models/best (3).pt'),
            'classes': model.names if model else {},
            'total_classes': len(model.names) if model else 0,
        }
        logger.info("ℹ️ Model info requested")
        return jsonify(info), 200
    except Exception as e:
        logger.error(f"❌ Error getting model info: {e}")
        return jsonify({'error': str(e)}), 500

# Initialize model on startup
@app.before_first_request
def startup():
    """Initialize on first request"""
    load_model()

if __name__ == '__main__':
    logger.info("🚀 AniResQ ML Service Starting...")
    load_model()
    logger.info("🌐 Flask server running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
