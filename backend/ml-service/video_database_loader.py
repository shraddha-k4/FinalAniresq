# """
# AniResQ Video Database Loader
# Loads and processes videos from a database directory
# """

# import os
# import cv2
# import logging
# import requests
# import json
# import argparse
# from pathlib import Path
# from datetime import datetime

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - [%(levelname)s] - %(message)s'
# )
# logger = logging.getLogger(__name__)

# class VideoDatabase:
#     def __init__(self, ml_service_url='http://localhost:5000'):
#         self.ml_service_url = ml_service_url
#         self.supported_formats = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']

#     def get_video_files(self, directory):
#         """Get all video files from directory"""
#         try:
#             video_files = []
#             path = Path(directory)

#             if not path.exists():
#                 logger.error(f"❌ Directory not found: {directory}")
#                 return []

#             if not path.is_dir():
#                 logger.error(f"❌ Path is not a directory: {directory}")
#                 return []

#             for video_format in self.supported_formats:
#                 video_files.extend(path.glob(f'**/*{video_format}'))
#                 video_files.extend(path.glob(f'**/*{video_format.upper()}'))

#             logger.info(f"📂 Found {len(video_files)} video(s) in {directory}")
#             return sorted(video_files)

#         except Exception as e:
#             logger.error(f"❌ Error scanning directory: {e}")
#             return []

#     def process_video(self, video_path, sample_every_n_frames=5, confidence=0.5):
#         """Process a single video file"""
#         try:
#             video_path = str(video_path)
#             logger.info(f"🎥 Processing video: {os.path.basename(video_path)}")

#             payload = {
#                 'video_path': video_path,
#                 'sample_every_n_frames': sample_every_n_frames,
#                 'confidence': confidence
#             }

#             response = requests.post(
#                 f'{self.ml_service_url}/api/detect/video',
#                 json=payload,
#                 timeout=600  # 10 minute timeout for video processing
#             )

#             if response.status_code == 200:
#                 result = response.json()
#                 return result
#             else:
#                 logger.error(f"❌ ML Service error: {response.status_code}")
#                 return None

#         except requests.exceptions.Timeout:
#             logger.error("❌ Video processing timeout")
#             return None
#         except requests.exceptions.ConnectionError:
#             logger.error(f"❌ Cannot connect to ML Service at {self.ml_service_url}")
#             return None
#         except Exception as e:
#             logger.error(f"❌ Error processing video: {e}")
#             return None

#     def process_video_database(self, directory, sample_every_n_frames=5, confidence=0.5, output_file=None):
#         """Process all videos in database"""
#         video_files = self.get_video_files(directory)

#         if not video_files:
#             logger.error("❌ No video files found")
#             return

#         logger.info("=" * 70)
#         logger.info("🚀 VIDEO DATABASE PROCESSING STARTED")
#         logger.info("=" * 70)

#         all_results = []
#         start_time = datetime.now()

#         for idx, video_file in enumerate(video_files, 1):
#             logger.info(f"\n[{idx}/{len(video_files)}] Processing...")
#             logger.info(f"📹 File: {video_file.name}")

#             result = self.process_video(video_file, sample_every_n_frames, confidence)

#             if result:
#                 all_results.append({
#                     'file': str(video_file),
#                     'filename': video_file.name,
#                     'result': result
#                 })

#                 # Print summary for this video
#                 logger.info(f"✅ Complete!")
#                 logger.info(f"   Total detections: {result.get('total_detections', 0)}")
#                 logger.info(f"   Frames processed: {result.get('frames_processed', 0)}")

#                 if result.get('detections'):
#                     logger.warning(f"🐾 Animals detected:")
#                     for detection in result['detections'][:5]:  # Show first 5
#                         logger.warning(f"   • {detection['class_name']} (Confidence: {detection['confidence']:.2%})")
#                     if len(result['detections']) > 5:
#                         logger.warning(f"   ... and {len(result['detections']) - 5} more")

#         # Print summary
#         elapsed = (datetime.now() - start_time).total_seconds()
#         self.print_summary(all_results, elapsed)

#         # Save results to file if specified
#         if output_file:
#             self.save_results(all_results, output_file)

#         return all_results

#     def print_summary(self, results, duration):
#         """Print summary statistics"""
#         logger.info("\n" + "=" * 70)
#         logger.info("📊 DATABASE PROCESSING SUMMARY")
#         logger.info("=" * 70)

#         total_detections = sum(r['result'].get('total_detections', 0) for r in results)
#         total_frames = sum(r['result'].get('frames_processed', 0) for r in results)
#         videos_with_detections = sum(1 for r in results if r['result'].get('detections'))

#         logger.info(f"Videos processed: {len(results)}")
#         logger.info(f"Videos with detections: {videos_with_detections}")
#         logger.info(f"Total detections: {total_detections}")
#         logger.info(f"Total frames processed: {total_frames}")
#         logger.info(f"Duration: {duration:.1f} seconds")
#         logger.info(f"Average time per video: {duration / len(results):.1f} seconds")
#         logger.info("=" * 70)

#     def save_results(self, results, output_file):
#         """Save results to JSON file"""
#         try:
#             with open(output_file, 'w') as f:
#                 json.dump(results, f, indent=2, default=str)
#             logger.info(f"✅ Results saved to: {output_file}")
#         except Exception as e:
#             logger.error(f"❌ Error saving results: {e}")

# def main():
#     parser = argparse.ArgumentParser(description='AniResQ Video Database Loader')
#     parser.add_argument('video_directory', help='Directory containing video files')
#     parser.add_argument('--ml-service', default='http://localhost:5000',
#                        help='ML Service URL (default: http://localhost:5000)')
#     parser.add_argument('--sample-frames', type=int, default=5,
#                        help='Sample every N frames (default: 5)')
#     parser.add_argument('--confidence', type=float, default=0.5,
#                        help='Confidence threshold (default: 0.5)')
#     parser.add_argument('--output', help='Output JSON file for results')

#     args = parser.parse_args()

#     logger.info("🚀 AniResQ Video Database Loader")
#     logger.info(f"ML Service URL: {args.ml_service}")

#     db = VideoDatabase(ml_service_url=args.ml_service)
#     db.process_video_database(
#         directory=args.video_directory,
#         sample_every_n_frames=args.sample_frames,
#         confidence=args.confidence,
#         output_file=args.output
#     )

# if __name__ == '__main__':
#     main()



"""
AniResQ Video Database Loader with Cloudinary Upload
Loads and processes videos from a database directory,
uploads media to Cloudinary, and sends detections to ML backend.
"""

import os
import logging
import requests
import json
import argparse
from pathlib import Path
from datetime import datetime
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv(dotenv_path=r"C:\Users\Shraddha\Desktop\CapP\aniresqget\AniResQ\backend\.env")

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True
)

class VideoDatabase:
    def __init__(self, ml_service_url='http://localhost:5000'):
        self.ml_service_url = ml_service_url
        self.supported_video_formats = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']
        self.supported_image_formats = ['.jpg', '.jpeg', '.png', '.bmp']

    def get_media_files(self, directory):
        """Get all video and image files from directory"""
        try:
            media_files = []
            path = Path(directory)

            if not path.exists():
                logger.error(f"❌ Directory not found: {directory}")
                return []

            if not path.is_dir():
                logger.error(f"❌ Path is not a directory: {directory}")
                return []

            # Videos
            for ext in self.supported_video_formats:
                media_files.extend(path.glob(f'**/*{ext}'))
                media_files.extend(path.glob(f'**/*{ext.upper()}'))

            # Images
            for ext in self.supported_image_formats:
                media_files.extend(path.glob(f'**/*{ext}'))
                media_files.extend(path.glob(f'**/*{ext.upper()}'))

            logger.info(f"📂 Found {len(media_files)} media files in {directory}")
            return sorted(media_files)

        except Exception as e:
            logger.error(f"❌ Error scanning directory: {e}")
            return []

    def process_video(self, video_path, sample_every_n_frames=5, confidence=0.5):
        """Send video to ML service for detection"""
        try:
            video_path = str(video_path)
            logger.info(f"🎥 Processing video: {os.path.basename(video_path)}")

            payload = {
                'video_path': video_path,
                'sample_every_n_frames': sample_every_n_frames,
                'confidence': confidence
            }

            response = requests.post(
                f'{self.ml_service_url}/api/detect/video',
                json=payload,
                timeout=600
            )

            if response.status_code == 200:
                result = response.json()
                return result
            else:
                logger.error(f"❌ ML Service error: {response.status_code} - {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.error("❌ Video processing timeout")
            return None
        except requests.exceptions.ConnectionError:
            logger.error(f"❌ Cannot connect to ML Service at {self.ml_service_url}")
            return None
        except Exception as e:
            logger.error(f"❌ Error processing video: {e}")
            return None

    def upload_to_cloudinary(self, file_path):
        """Upload a video or image to Cloudinary"""
        try:
            logger.info(f"☁️ Uploading {file_path.name} to Cloudinary...")
            response = cloudinary.uploader.upload_large(
                str(file_path),
                resource_type='auto'
            )
            logger.info(f"✅ Uploaded URL: {response.get('secure_url')}")
            return response.get('secure_url')
        except Exception as e:
            logger.error(f"❌ Cloudinary upload failed: {e}")
            return None

    def send_to_backend(self, cctv_id, detections, cloud_url):
        """Send detection + Cloudinary URL to backend"""
        try:
            payload = {
                'cctv_id': cctv_id,
                'timestamp': datetime.now().isoformat(),
                'detections': detections,
                'total': len(detections),
                'videoUrl': cloud_url
            }
            logger.info(f"📤 Sending detection to backend with videoUrl: {cloud_url}")
            r = requests.post(f"{self.ml_service_url}/api/wildDetection/detections", json=payload, timeout=30)
            if r.status_code == 201:
                logger.info("✅ Alert sent to backend successfully")
            else:
                logger.warning(f"⚠️ Backend responded with status {r.status_code} - {r.text}")
        except Exception as e:
            logger.error(f"❌ Failed to send alert to backend: {e}")

    def process_media_database(self, directory, sample_every_n_frames=5, confidence=0.5, output_file=None):
        """Process all media files in database and upload to Cloudinary"""
        media_files = self.get_media_files(directory)

        if not media_files:
            logger.error("❌ No media files found")
            return

        logger.info("=" * 70)
        logger.info("🚀 MEDIA DATABASE PROCESSING STARTED")
        logger.info("=" * 70)

        all_results = []
        start_time = datetime.now()

        for idx, media_file in enumerate(media_files, 1):
            logger.info(f"\n[{idx}/{len(media_files)}] Processing: {media_file.name}")

            result = None
            if media_file.suffix.lower() in self.supported_video_formats:
                # Process video
                result = self.process_video(media_file, sample_every_n_frames, confidence)
            else:
                # For images, optionally run detection via ML API if supported
                result = {"file_type": "image", "detections": []}

            # Upload to Cloudinary
            cloud_url = self.upload_to_cloudinary(media_file)

            # Send to backend with Cloudinary URL
            self.send_to_backend(cctv_id="aniresq_cam_1", detections=result.get('detections', []), cloud_url=cloud_url)

            all_results.append({
                'file': str(media_file),
                'filename': media_file.name,
                'cloud_url': cloud_url,
                'result': result
            })

        # Print summary
        elapsed = (datetime.now() - start_time).total_seconds()
        self.print_summary(all_results, elapsed)

        # Save results to file if specified
        if output_file:
            self.save_results(all_results, output_file)

        return all_results

    def print_summary(self, results, duration):
        """Print summary statistics"""
        logger.info("\n" + "=" * 70)
        logger.info("📊 DATABASE PROCESSING SUMMARY")
        logger.info("=" * 70)

        total_videos = sum(1 for r in results if r['result'].get('file_type', 'video') == 'video')
        total_images = sum(1 for r in results if r['result'].get('file_type', 'video') != 'video')
        total_detections = sum(r['result'].get('total_detections', 0) for r in results if r['result'])

        logger.info(f"Total media processed: {len(results)}")
        logger.info(f"Videos: {total_videos}")
        logger.info(f"Images: {total_images}")
        logger.info(f"Total detections: {total_detections}")
        logger.info(f"Duration: {duration:.1f} seconds")
        logger.info(f"Average time per media: {duration / len(results):.1f} seconds")
        logger.info("=" * 70)

    def save_results(self, results, output_file):
        """Save results to JSON file"""
        try:
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            logger.info(f"✅ Results saved to: {output_file}")
        except Exception as e:
            logger.error(f"❌ Error saving results: {e}")


def main():
    parser = argparse.ArgumentParser(description='AniResQ Media Database Loader')
    parser.add_argument('media_directory', help='Directory containing media files')
    parser.add_argument('--ml-service', default='http://localhost:5000',
                        help='ML Service URL')
    parser.add_argument('--sample-frames', type=int, default=5,
                        help='Sample every N frames for videos')
    parser.add_argument('--confidence', type=float, default=0.5,
                        help='Confidence threshold')
    parser.add_argument('--output', help='Output JSON file for results')

    args = parser.parse_args()

    logger.info("🚀 AniResQ Media Database Loader")
    logger.info(f"ML Service URL: {args.ml_service}")

    db = VideoDatabase(ml_service_url=args.ml_service)
    db.process_media_database(
        directory=args.media_directory,
        sample_every_n_frames=args.sample_frames,
        confidence=args.confidence,
        output_file=args.output
    )


if __name__ == '__main__':
    main()