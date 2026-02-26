"""
Configuration for ML Service
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Model Configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n.pt')
CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', 0.5))

# Backend Configuration
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3000')
BACKEND_API_KEY = os.getenv('BACKEND_API_KEY', '')

# CCTV Stream Configuration
CCTV_STREAM_URLS = os.getenv('CCTV_STREAM_URLS', '').split(',')
CCTV_FPS = int(os.getenv('CCTV_FPS', 1))  # Frames per second to process
STREAM_TIMEOUT = int(os.getenv('STREAM_TIMEOUT', 30))  # Seconds to wait before reconnecting

# Alert Configuration
DUPLICATE_ALERT_THRESHOLD = int(os.getenv('DUPLICATE_ALERT_THRESHOLD', 30))  # Seconds between alerts

# Logging Configuration
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = os.getenv('LOG_FILE', 'ml_service.log')

# Processing Configuration
FRAME_HEIGHT = int(os.getenv('FRAME_HEIGHT', 480))
FRAME_WIDTH = int(os.getenv('FRAME_WIDTH', 640))
USE_GPU = os.getenv('USE_GPU', 'False').lower() == 'true'
