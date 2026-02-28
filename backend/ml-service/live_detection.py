
import cv2
import numpy as np
import requests
import logging
import os
import time
import torch
from ultralytics import YOLO
from datetime import datetime
from collections import deque
import tempfile
import platform
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

# ================= LOAD ENV =================
load_dotenv(dotenv_path=r"C:\Users\Shraddha\Desktop\CapP\aniresqget\AniResQ\backend\.env")

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

# ================= CLOUDINARY CONFIG =================
cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True
)

# ================= CPU OPTIMIZATION =================
torch.set_num_threads(os.cpu_count())
torch.backends.mkldnn.enabled = True

# ================= LOGGING =================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

# ================= DETECTOR CLASS =================
class LiveAnimalDetector:
    def __init__(self, model_path, backend_url, confidence_threshold=0.6,
                 clip_duration_sec=3, track_cooldown_sec=20):
        self.backend_url = backend_url
        self.confidence_threshold = confidence_threshold
        self.clip_duration_sec = clip_duration_sec
        self.track_cooldown_sec = track_cooldown_sec

        self.animal_classes = {"porcupine", "animal_redfox", "hyena", "tiger"}
        self.active_tracks = {}
        self.stats = {
            "total_frames": 0,
            "total_detections": 0,
            "animal_counts": {},
            "alerts_sent": 0,
            "start_time": time.time()
        }

        logger.info(f"Loading model: {model_path}")
        self.model = YOLO(model_path)
        logger.info("Model loaded successfully")

    def is_animal(self, class_name):
        return str(class_name).lower() in self.animal_classes

    def capture_clip(self, frame_buffer, fps=10):
        if len(frame_buffer) == 0:
            return None
        h, w = frame_buffer[0].shape[:2]
        temp_file = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        path = temp_file.name
        temp_file.close()
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(path, fourcc, fps, (w, h))
        for frame in frame_buffer:
            out.write(frame)
        out.release()
        logger.info(f"Clip saved locally: {path}")
        return path

    def upload_video(self, video_path):
        try:
            result = cloudinary.uploader.upload_large(video_path, resource_type="video")
            url = result.get("secure_url")
            logger.info(f"Video uploaded to Cloudinary: {url}")
            return url
        except Exception as e:
            logger.error(f"Cloudinary upload failed: {e}")
            return None

    def send_alert(self, detections, cctv_id, video_path=None, location=None):
        """
        Send alert to backend.
        detections: list of dicts, each with 'track_id', 'animal', 'confidence'
        location: dict {"locationName": ..., "latitude": ..., "longitude": ...}
        """
        video_url = self.upload_video(video_path) if video_path else None

        for d in detections:
            payload = {
                "cctv_id": cctv_id,
                "animal": d["animal"],
                "confidence": round(d["confidence"]*100, 2),  # convert to percentage
                "behavior": "",  # optional
                "distance": "",  # optional
                "locationName": location.get("locationName") if location else None,
                "latitude": location.get("latitude") if location else None,
                "longitude": location.get("longitude") if location else None,
                "videoUrl": video_url,
                "timestamp": datetime.now().isoformat()
            }

            try:
                r = requests.post(
                    f"{self.backend_url}/api/wildDetection/detections",
                    json=payload,
                    timeout=30
                )
                if r.status_code == 201:
                    logger.info(f"Alert for {d['animal']} sent successfully")
                    self.stats["alerts_sent"] += 1
                else:
                    logger.warning(f"Backend responded with {r.status_code}: {r.text}")
            except Exception as e:
                logger.error(f"Failed to send alert: {e}")

    def print_summary(self, cctv_id):
        end_time = time.time()
        duration = end_time - self.stats["start_time"]
        fps = self.stats["total_frames"] / duration if duration > 0 else 0

        print("\n" + "="*60)
        print("AniResQ Detection Summary")
        print("="*60)
        print(f"CCTV ID: {cctv_id}")
        print(f"Runtime: {duration:.2f} seconds")
        print(f"Total Frames Processed: {self.stats['total_frames']}")
        print(f"Total Animal Detections: {self.stats['total_detections']}")
        print(f"Total Alerts Sent: {self.stats['alerts_sent']}")
        print(f"Average FPS: {fps:.2f}")
        print("\nAnimal Counts:")
        for animal, count in self.stats["animal_counts"].items():
            print(f"{animal}: {count}")
        print("\nSystem Info:")
        print(f"CPU: {platform.processor()}")
        print(f"OS: {platform.system()}")
        print("="*60)

    def detect(self, camera_index=0, cctv_id="cam_001", show=True):
        cap = cv2.VideoCapture(camera_index)
        if not cap.isOpened():
            logger.error("Camera not opened")
            return

        fps = 10
        frame_buffer = deque(maxlen=fps*self.clip_duration_sec)
        frame_count = 0
        logger.info("Starting live detection")
        cv2.namedWindow("AniResQ Live Detection", cv2.WINDOW_NORMAL)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            self.stats["total_frames"] += 1
            frame_buffer.append(frame.copy())
            frame_count += 1
            if frame_count % 5 != 0:
                continue

            resized = cv2.resize(frame, (320, 256))
            results = self.model.track(
                resized,
                conf=self.confidence_threshold,
                persist=True,
                tracker="bytetrack.yaml",
                device="cpu"
            )

            detections = []
            if results[0].boxes is not None:
                for box in results[0].boxes:
                    cls_id = int(box.cls[0])
                    class_name = self.model.names[cls_id]
                    conf = float(box.conf[0])
                    track_id = int(box.id[0]) if box.id is not None else -1
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    if self.is_animal(class_name):
                        detections.append({
                            "track_id": track_id,
                            "animal": class_name,
                            "confidence": conf
                        })
                        self.stats["total_detections"] += 1
                        self.stats["animal_counts"][class_name] = self.stats["animal_counts"].get(class_name, 0) + 1
                        color = (0, 255, 0)
                    else:
                        color = (255, 255, 0)

                    cv2.rectangle(resized, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(resized, f"{class_name} ID:{track_id} {conf:.2f}", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # Alert logic
            alert = False
            valid_detections = []
            current_time = time.time()

            for d in detections:
                tid = d["track_id"]
                if tid not in self.active_tracks or current_time - self.active_tracks[tid] > self.track_cooldown_sec:
                    self.active_tracks[tid] = current_time
                    alert = True
                    valid_detections.append(d)

            if alert and valid_detections:
                logger.warning("Animal detected — sending alert")
                clip_path = self.capture_clip(frame_buffer)

                location_info = {
                    "locationName": "Forest Zone 1",
                    "latitude": 12.9716,
                    "longitude": 77.5946
                }

                self.send_alert(valid_detections, cctv_id, clip_path, location_info)

                if clip_path and os.path.exists(clip_path):
                    os.remove(clip_path)

            if show:
                cv2.imshow("AniResQ Live Detection", resized)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

        cap.release()
        cv2.destroyAllWindows()
        self.print_summary(cctv_id)

# ================= MAIN =================
def main():
    MODEL = "./models/best.pt"
    BACKEND = "http://localhost:3000"

    detector = LiveAnimalDetector(
        MODEL,
        BACKEND,
        confidence_threshold=0.65,
        clip_duration_sec=3,
        track_cooldown_sec=20
    )
    detector.detect(camera_index=0, cctv_id="aniresq_cam_1", show=True)

if __name__ == "__main__":
    main()