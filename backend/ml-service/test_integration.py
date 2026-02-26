"""
Integration Test for AniResQ Live Detection System
Validates model, backend connectivity, and detection pipeline
"""

import os
import sys
import json
import time
import logging
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load env
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

class IntegrationTest:
    """Test suite for live detection system"""
    
    def __init__(self):
        self.model_path = os.getenv('MODEL_PATH', './models/best.pt')
        self.backend_url = os.getenv('BACKEND_URL', 'http://localhost:3000')
        self.ml_service_url = os.getenv('ML_SERVICE_URL', 'http://localhost:5000')
        self.cctv_id = os.getenv('TEST_CCTV_ID', 'test_cctv_001')
        self.passed = 0
        self.failed = 0
    
    def log_test(self, name, passed, message=""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        logger.info(f"{status}: {name}")
        if message:
            logger.info(f"       {message}")
        if passed:
            self.passed += 1
        else:
            self.failed += 1
    
    def test_model_file_exists(self):
        """Check if model file exists"""
        exists = os.path.isfile(self.model_path)
        self.log_test(
            "Model file exists",
            exists,
            f"Model path: {self.model_path}"
        )
        return exists
    
    def test_model_loads(self):
        """Test if YOLOv8 model loads"""
        try:
            from ultralytics import YOLO
            model = YOLO(self.model_path)
            classes = list(model.names.values())
            self.log_test(
                "YOLOv8 model loads",
                True,
                f"Classes: {classes}"
            )
            return True, model
        except Exception as e:
            self.log_test("YOLOv8 model loads", False, str(e))
            return False, None
    
    def test_animal_classes(self, model):
        """Verify model has required animal classes"""
        if not model:
            self.log_test("Animal classes present", False, "Model not loaded")
            return False
        
        required_classes = {'porcupine', 'redfox', 'hyena', 'tiger'}
        model_classes = set(str(c).lower() for c in model.names.values())
        has_all = required_classes.issubset(model_classes)
        
        self.log_test(
            "Animal classes present",
            has_all,
            f"Required: {required_classes}, Found: {model_classes}"
        )
        return has_all
    
    def test_backend_health(self):
        """Test backend server connectivity"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=5)
            is_ok = response.status_code == 200
            self.log_test(
                "Backend server health",
                is_ok,
                f"Status: {response.status_code}"
            )
            return is_ok
        except Exception as e:
            self.log_test("Backend server health", False, f"Connection error: {e}")
            return False
    
    def test_ml_service_health(self):
        """Test ML service (Flask) connectivity"""
        try:
            response = requests.get(f"{self.ml_service_url}/health", timeout=5)
            is_ok = response.status_code == 200
            self.log_test(
                "ML Service (Flask) health",
                is_ok,
                f"Status: {response.status_code}"
            )
            return is_ok
        except Exception as e:
            self.log_test(
                "ML Service (Flask) health",
                False,
                f"Not running on {self.ml_service_url}"
            )
            return False
    
    def test_detection_endpoint(self):
        """Test if detection endpoint accepts requests"""
        try:
            test_payload = {
                'cctv_id': self.cctv_id,
                'timestamp': '2026-02-26T14:35:30.000Z',
                'detections': [
                    {
                        'class_id': 4,
                        'class_name': 'tiger',
                        'confidence': 0.87,
                        'bbox': {
                            'x_min': 100,
                            'y_min': 100,
                            'x_max': 200,
                            'y_max': 200
                        }
                    }
                ],
                'total_detections': 1,
                'frame_shape': [480, 640]
            }
            
            response = requests.post(
                f"{self.backend_url}/api/detections",
                json=test_payload,
                timeout=10
            )
            
            is_ok = response.status_code in [200, 201]
            self.log_test(
                "Detection endpoint responsive",
                is_ok,
                f"Status: {response.status_code}"
            )
            return is_ok, response.status_code
        except Exception as e:
            self.log_test("Detection endpoint responsive", False, str(e))
            return False, None
    
    def test_cloudinary_config(self):
        """Check Cloudinary configuration"""
        try:
            from backend.src.config.cloudinary import cloudinary
            config = cloudinary.config()
            has_config = bool(config.cloud_name and config.api_key)
            
            self.log_test(
                "Cloudinary configured",
                has_config,
                f"Cloud: {config.cloud_name or 'NOT SET'}"
            )
            return has_config
        except ImportError:
            # Try alternative: load from env
            cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
            api_key = os.getenv('CLOUDINARY_API_KEY')
            has_config = bool(cloud_name and api_key)
            
            self.log_test(
                "Cloudinary configured",
                has_config,
                "Check .env: CLOUDINARY_* variables"
            )
            return has_config
    
    def test_mongodb_connection(self):
        """Check MongoDB Atlas configuration"""
        try:
            import pymongo
            mongo_url = os.getenv('MONGODB_URI', 'mongodb+srv://...')
            # Don't actually connect, just check if URI is set
            has_mongo = not mongo_url.startswith('mongodb')
            
            self.log_test(
                "MongoDB URI configured",
                has_mongo,
                "Check .env: MONGODB_URI"
            )
            return has_mongo
        except ImportError:
            self.log_test("MongoDB driver installed", False, "pip install pymongo")
            return False
    
    def test_live_detection_script(self):
        """Check if live detection script exists"""
        script_path = Path('./live_detection.py')
        exists = script_path.is_file()
        self.log_test(
            "Live detection script available",
            exists,
            f"Path: {script_path.absolute()}"
        )
        return exists
    
    def run_all_tests(self):
        """Run complete test suite"""
        logger.info("=" * 70)
        logger.info("🧪 AniResQ Live Detection Integration Tests")
        logger.info("=" * 70)
        
        # Model tests
        logger.info("\n📦 MODEL TESTS:")
        self.test_model_file_exists()
        loaded, model = self.test_model_loads()
        if loaded:
            self.test_animal_classes(model)
        
        # Backend tests
        logger.info("\n🔌 BACKEND TESTS:")
        backend_ok = self.test_backend_health()
        if backend_ok:
            self.test_detection_endpoint()
        
        # Service tests
        logger.info("\n⚙️  SERVICE TESTS:")
        self.test_ml_service_health()
        self.test_live_detection_script()
        
        # Configuration tests
        logger.info("\n📋 CONFIGURATION TESTS:")
        self.test_cloudinary_config()
        self.test_mongodb_connection()
        
        # Summary
        logger.info("\n" + "=" * 70)
        logger.info(f"📊 RESULTS: {self.passed} passed, {self.failed} failed")
        logger.info("=" * 70)
        
        if self.failed == 0:
            logger.info("✅ All tests passed! System ready for live detection.")
            return True
        else:
            logger.warning(f"⚠️  {self.failed} test(s) failed. See details above.")
            return False

def main():
    """Run integration tests"""
    tester = IntegrationTest()
    success = tester.run_all_tests()
    
    # Exit code
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
