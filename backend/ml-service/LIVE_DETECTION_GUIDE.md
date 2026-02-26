# AniResQ Live Animal Detection with Video Storage

This guide shows how to test the live detection system using your trained `best.pt` model with camera feeds.

## Overview

The system detects animals in real-time from CCTV/webcam feeds:
- ✅ Detects: **porcupine, redfox, hyena, tiger**
- ❌ Ignores: **humans** (filters them out)
- 📹 Captures short video clips (3 seconds) on animal sighting
- 💾 Stores videos in MongoDB Atlas via Cloudinary
- 🔔 Prints alerts to terminal with confidence scores

**Architecture:**
```
Camera Feed 
    ↓
Live Detection Script (YOLOv8 inference)
    ↓
Filter animals (exclude humans)
    ↓
Capture short video clip from buffer
    ↓
POST to Backend API with video file + detection data
    ↓
Backend stores video using Cloudinary
Backend saves detection record to MongoDB Atlas
```

## File Structure

```
backend/ml-service/
├── best.pt                          # Your trained model
├── live_detection.py               # NEW: Live detection script
├── flask_app.py                    # Flask REST API (optional)
├── app.py                          # ML Service stream processor
├── camera_client.py                # Old: Frame-by-frame client
├── requirements.txt                # Python dependencies
├── config.py                       # Configuration
└── .env                            # Environment variables
```

## Setup

### 1. Copy Your Trained Model

Place your trained `best.pt` file:
```bash
# Windows
copy "C:\your\model\path\best.pt" "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\best.pt"

# macOS/Linux
cp /your/model/path/best.pt ~/AniResQ/backend/ml-service/models/best.pt
```

### 2. Install Python Dependencies

```bash
cd "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service"

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Update `.env` Configuration

Edit [.env](backend/ml-service/.env):
```env
# Model Configuration
MODEL_PATH=./models/best.pt
CONFIDENCE_THRESHOLD=0.5

# Backend Configuration
BACKEND_URL=http://localhost:3000
BACKEND_API_KEY=your_api_key_here

# ML Service Settings
CLIP_FRAMES=30
TMPDIR=/tmp  # or C:\Temp on Windows
```

### 4. Start Backend Server

In another terminal:
```bash
cd "d:\3rd year\AniResQ Final\AniResQ\backend"
npm install
npm start
```

**Expected output:**
```
[INFO] AniResQ Backend Server running on http://localhost:3000
[INFO] MongoDB connected
[INFO] Cloudinary configured
```

## Running Live Detection

### Option 1: Live Webcam Detection (Recommended for Testing)

```bash
cd "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service"
python live_detection.py --cctv-id cctv_001 --camera 0 --duration 60
```

**Parameters:**
- `--model` : Path to model (default: `./models/best.pt`)
- `--backend` : Backend URL (default: `http://localhost:3000`)
- `--camera` : Camera index (default: 0 for built-in webcam)
- `--cctv-id` : CCTV camera identifier (default: `cctv_001`)
- `--confidence` : Detection threshold 0.0-1.0 (default: 0.5)
- `--duration` : Run for N seconds (optional, default: infinite)

### Option 2: Flask API Endpoint

Start the Flask API wrapper:
```bash
python flask_app.py
# Server runs on http://localhost:5000
```

Then trigger detection:
```bash
curl -X POST http://localhost:5000/api/detect/camera \
  -H "Content-Type: application/json" \
  -d '{
    "duration_seconds": 30,
    "confidence": 0.5,
    "camera_index": 0
  }'
```

## Example Terminal Output

```
2026-02-26 14:35:22 - [INFO] - 🚀 AniResQ Live Animal Detection Service
2026-02-26 14:35:22 - [INFO] - 📦 Loading model from: ./models/best.pt
2026-02-26 14:35:28 - [INFO] - ✅ Model loaded! Classes: ['porcupine', 'redfox', 'hyena', 'humans', 'tiger']
2026-02-26 14:35:28 - [INFO] - 🎥 Starting live detection from camera 0
2026-02-26 14:35:28 - [INFO] - 📌 CCTV ID: cctv_001
2026-02-26 14:35:28 - [INFO] - 🎯 Filtering for: porcupine, redfox, hyena, tiger
2026-02-26 14:35:28 - [INFO] - ✅ Camera opened: 1280x720 @ 30.0 FPS
2026-02-26 14:35:30 - [WARNING] - 🚨 ALERT: tiger detected - Confidence: 0.87
2026-02-26 14:35:31 - [INFO] - 📤 Capturing clip and sending alert...
2026-02-26 14:35:31 - [INFO] - ✅ Clip created: C:\Temp\detection_cctv_001_1708953331.mp4 (30 frames)
2026-02-26 14:35:32 - [INFO] - ✅ Alert sent to backend (status: 201)
2026-02-26 14:35:45 - [WARNING] - 🚨 ALERT: hyena detected - Confidence: 0.72
2026-02-26 14:35:46 - [INFO] - 📤 Capturing clip and sending alert...
```

## Database Records

### MongoDB Detection Collection

After alerts are sent, MongoDB Atlas contains:

```javascript
{
  "_id": ObjectId("..."),
  "cctvId": ObjectId("cctv_camera_id"),
  "detectionTimestamp": ISODate("2026-02-26T14:35:30.000Z"),
  "objects": [
    {
      "classId": 4,
      "className": "tiger",
      "confidence": 0.87,
      "bbox": {
        "xMin": 245.3,
        "yMin": 120.5,
        "xMax": 580.1,
        "yMax": 450.2
      }
    }
  ],
  "totalDetections": 1,
  "severity": "high",
  "videoUrl": "https://res.cloudinary.com/...../detection_video.mp4",
  "processedAt": ISODate("2026-02-26T14:35:32.000Z"),
  "createdAt": ISODate("2026-02-26T14:35:30.000Z")
}
```

## Verification Checklist

- [ ] Model file exists: `backend/ml-service/models/best.pt`
- [ ] Backend server is running on port 3000
- [ ] Environment variables are set (BACKEND_URL, MODEL_PATH)
- [ ] Cloudinary is configured in backend `.env`
- [ ] MongoDB Atlas connection is active
- [ ] Webcam is accessible and not in use by other apps

## Troubleshooting

### "Cannot open camera 0"
- Check if webcam is being used by another application
- Try camera index: `--camera 1` or `--camera 2`
- On Windows: Settings → Privacy → Camera

### "Model not found"
```bash
# Check file exists
dir "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\"
# Should show: best.pt
```

### "Cannot connect to backend"
```bash
# Verify backend is running
curl http://localhost:3000/health

# Check if port 3000 is in use
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000
```

### "Cloudinary upload failed"
- Check Cloudinary credentials in backend `/.env`
- Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set

### Low Detection Accuracy
- Lower confidence threshold: `--confidence 0.3`
- Check that your model was trained on these classes:
  - porcupine, redfox, hyena, humans, tiger
- Ensure lighting is adequate

## Advanced Usage

### Custom Model Classes

If your model has different class names, edit [live_detection.py](live_detection.py):

```python
self.animal_classes = {'porcupine', 'redfox', 'hyena', 'tiger'}  # Line ~29
```

### Batch Processing Videos

Process multiple saved videos:
```bash
python video_database_loader.py /path/to/videos/directory \
  --ml-service http://localhost:5000 \
  --sample-frames 5 \
  --confidence 0.5
```

### REST API Testing

Test individual endpoints:
```bash
# Get model info
curl http://localhost:5000/api/model/info

# Test image detection
curl -X POST http://localhost:5000/api/detect/image \
  -F "image=@test.jpg"

# Get detection stats
curl http://localhost:3000/api/detections/stats
```

## Next Steps

1. **Train alerting system** - Notify users via email/SMS
2. **Implement live dashboard** - Show real-time detections
3. **Add geo-mapping** - Map animal sightings by location
4. **Integrate with wildlife tracking** - Link to conservation efforts
5. **Performance optimization** - Batch processing, caching, load balancing

## Support

For issues or questions:
1. Check logs: `live_detection.py` output
2. Verify model file integrity
3. Test backend connectivity
4. Check Cloudinary configuration
