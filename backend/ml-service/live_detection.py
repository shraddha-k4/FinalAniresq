"""
AniResQ Live Detection Service (Production Optimized Version)
Features:
- YOLOv8 tracking with unique IDs
- Prevent duplicate alerts
- CPU optimized detection
- Live camera display
- Video clip capture
- Backend alert sending
- Final detection summary report
"""

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
import json
import tempfile
import platform


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

    def __init__(
        self,
        model_path,
        backend_url,
        confidence_threshold=0.6,
        clip_duration_sec=3,
        track_cooldown_sec=20
    ):

        self.backend_url = backend_url
        self.confidence_threshold = confidence_threshold
        self.clip_duration_sec = clip_duration_sec
        self.track_cooldown_sec = track_cooldown_sec

        self.animal_classes = {
            "porcupine",
            "redfox",
            "hyena",
            "tiger"
        }

        self.active_tracks = {}

        # Statistics tracking
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


    # ================= CHECK ANIMAL =================

    def is_animal(self, class_name):

        return str(class_name).lower() in self.animal_classes


    # ================= CAPTURE CLIP =================

    def capture_clip(self, frame_buffer, fps=10):

        if len(frame_buffer) == 0:
            return None

        h, w = frame_buffer[0].shape[:2]

        temp_file = tempfile.NamedTemporaryFile(
            suffix=".mp4",
            delete=False
        )

        path = temp_file.name
        temp_file.close()

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')

        out = cv2.VideoWriter(path, fourcc, fps, (w, h))

        for frame in frame_buffer:
            out.write(frame)

        out.release()

        logger.info(f"Clip saved: {path}")

        return path


    # ================= SEND ALERT =================

    def send_alert(self, detections, cctv_id, video_path):

        try:

            data = {
                "cctv_id": cctv_id,
                "timestamp": datetime.now().isoformat(),
                "detections": json.dumps(detections),
                "total": len(detections)
            }

            if video_path:

                with open(video_path, "rb") as f:

                    files = {"video": f}

                    r = requests.post(
                        f"{self.backend_url}/api/detections",
                        data=data,
                        files=files,
                        timeout=30
                    )

            else:

                r = requests.post(
                    f"{self.backend_url}/api/detections",
                    json=data,
                    timeout=10
                )

            if r.status_code == 201:

                logger.info("Alert sent to backend")
                self.stats["alerts_sent"] += 1

            else:

                logger.warning(f"Backend error {r.status_code}")

        except Exception as e:

            logger.error(f"Alert failed: {e}")


    # ================= PRINT SUMMARY =================

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

        if len(self.stats["animal_counts"]) == 0:

            print("No animals detected")

        else:

            for animal, count in self.stats["animal_counts"].items():

                print(f"{animal}: {count}")

        print("\nSystem Info:")
        print(f"CPU: {platform.processor()}")
        print(f"OS: {platform.system()}")

        print("="*60)


    # ================= MAIN DETECTION =================

    def detect(self, camera_index=0, cctv_id="cam_001", show=True):

        try:

            cap = cv2.VideoCapture(camera_index)

            if not cap.isOpened():

                logger.error("Camera not opened")
                return

            fps = 10
            buffer_size = fps * self.clip_duration_sec

            frame_buffer = deque(maxlen=buffer_size)

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

                # CPU optimization: skip frames
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
                                "class": class_name,
                                "confidence": conf
                            })

                            # stats update
                            self.stats["total_detections"] += 1

                            if class_name not in self.stats["animal_counts"]:
                                self.stats["animal_counts"][class_name] = 0

                            self.stats["animal_counts"][class_name] += 1

                            color = (0,255,0)

                        else:

                            color = (255,255,0)

                        cv2.rectangle(resized,(x1,y1),(x2,y2),color,2)

                        cv2.putText(
                            resized,
                            f"{class_name} ID:{track_id}",
                            (x1,y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            color,
                            2
                        )

                # alert control
                alert = False
                current_time = time.time()
                valid_detections = []

                for d in detections:

                    tid = d["track_id"]

                    if tid not in self.active_tracks:

                        self.active_tracks[tid] = current_time
                        alert = True
                        valid_detections.append(d)

                    else:

                        last = self.active_tracks[tid]

                        if current_time - last > self.track_cooldown_sec:

                            self.active_tracks[tid] = current_time
                            alert = True
                            valid_detections.append(d)

                if alert:

                    logger.warning("Animal detected — sending alert")

                    clip = self.capture_clip(frame_buffer)

                    self.send_alert(valid_detections, cctv_id, clip)

                    if clip and os.path.exists(clip):
                        os.remove(clip)

                if show:

                    cv2.imshow("AniResQ Live Detection", resized)

                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        break


        except KeyboardInterrupt:

            logger.info("Stopping AniResQ safely...")

        finally:

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

    detector.detect(

        camera_index=0,
        cctv_id="aniresq_cam_1",
        show=True

    )


if __name__ == "__main__":

    main()