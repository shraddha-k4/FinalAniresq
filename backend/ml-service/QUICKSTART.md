# 🚀 Quick Start: Live Animal Detection Testing

Follow these steps to test the live detection system with your trained `best.pt` model.

## 📋 Prerequisites

- Python 3.8+
- Webcam/Camera connected to your machine
- Backend server running on `http://localhost:3000`
- MongoDB Atlas connection configured
- Cloudinary configured for video uploads

## ⚡ 5-Minute Setup

### Step 1: Copy Your Model
```bash
# Place your trained best.pt in:
d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\best.pt
```

### Step 2: Install Dependencies
```bash
cd "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service"
pip install -r requirements.txt
```

### Step 3: Start Backend Server
```bash
# In a separate terminal
cd "d:\3rd year\AniResQ Final\AniResQ\backend"
npm install
npm start
```

Wait for: **"✅ AniResQ Backend Server running on http://localhost:3000"**

### Step 4: Run Live Detection
```bash
cd "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service"
python live_detection.py --cctv-id cctv_001 --camera 0 --duration 60
```

## 🧪 Verification Tests

Run the integration test suite:
```bash
python test_integration.py
```

**Expected output:**
```
✅ PASS: Model file exists
✅ PASS: YOLOv8 model loads
✅ PASS: Animal classes present
✅ PASS: Backend server health
✅ PASS: Detection endpoint responsive
✅ PASS: Cloudinary configured
✅ PASS: MongoDB URI configured
✅ PASS: Live detection script available

📊 RESULTS: 8 passed, 0 failed
✅ All tests passed! System ready for live detection.
```

## 🎥 Live Detection Output

When an animal is detected, you'll see in the terminal:

```
2026-02-26 14:35:22 - [INFO] - 📦 Loading model from: ./models/best.pt
2026-02-26 14:35:28 - [INFO] - ✅ Model loaded! Classes: ['porcupine', 'redfox', 'hyena', 'humans', 'tiger']
2026-02-26 14:35:28 - [INFO] - 🎥 Starting live detection from camera 0
2026-02-26 14:35:28 - [INFO] - 🎯 Filtering for: porcupine, redfox, hyena, tiger
2026-02-26 14:35:28 - [INFO] - ✅ Camera opened: 1280x720 @ 30.0 FPS
========================================================================

2026-02-26 14:35:30 - [WARNING] - 🚨 ALERT: tiger detected - Confidence: 0.87
2026-02-26 14:35:31 - [INFO] - 📤 Capturing clip and sending alert...
2026-02-26 14:35:31 - [INFO] - ✅ Clip created: C:\Temp\detection_cctv_001_1708953331.mp4 (30 frames)
2026-02-26 14:35:32 - [INFO] - ✅ Alert sent to backend (status: 201)

2026-02-26 14:35:45 - [WARNING] - 🚨 ALERT: hyena detected - Confidence: 0.72
2026-02-26 14:35:46 - [INFO] - 📤 Capturing clip and sending alert...
2026-02-26 14:35:46 - [INFO] - ✅ Clip created: C:\Temp\detection_cctv_001_1708953334.mp4 (30 frames)
2026-02-26 14:35:47 - [INFO] - ✅ Alert sent to backend (status: 201)
```

## 📊 What Happens Behind the Scenes

1. **Model Loading** (4-6 seconds)
   - YOLOv8 model (`best.pt`) loads into memory
   - Classes verified: porcupine, redfox, hyena, tiger, humans

2. **Camera Connection**
   - Opens default webcam (camera index 0)
   - Reads frames at native FPS (typically 30 FPS)
   - Buffers last 30 frames (3 seconds at 10 FPS)

3. **Inference** (Every 5 frames to reduce load)
   - Resizes frame to 640x480
   - Runs YOLOv8 detection at 0.5 confidence threshold
   - Returns class name, confidence, bounding box

4. **Human Filtering** ✂️
   - Detections are filtered to exclude "humans" and "humans" class
   - Only animal detections trigger alerts

5. **Alert Generation** 🚨
   - Terminal prints: Class name + confidence score
   - Example: "ALERT: tiger - Confidence: 0.87"
   - Cooldown: 10 seconds per animal class (prevents spam)

6. **Video Capture** 📹
   - Captures last 30 frames from buffer
   - Encodes as MP4 video (3 seconds @ 10 FPS)
   - Saves to temp directory

7. **Backend Upload** 📤
   - POSTs to `http://localhost:3000/api/detections`
   - Sends multipart/form-data with:
     - Video file attachment
     - Detection metadata (class, confidence, timestamp)
   - Status: HTTP 201 Created

8. **Database Storage** 💾
   - Video uploaded to Cloudinary (returns secure URL)
   - Detection record saved to MongoDB Atlas with:
     - CCTV ID
     - Timestamp
     - Animal detections
     - Video URL
     - Severity level

## 🔧 Common Parameters

```bash
# Run for 5 minutes with lower confidence (more detections)
python live_detection.py --camera 0 --confidence 0.3 --duration 300

# Use specific model file
python live_detection.py --model "./models/my_trained_model.pt"

# Connect to remote backend
python live_detection.py --backend "http://192.168.1.100:3000"

# Multiple cameras (if available)
python live_detection.py --camera 0  # Laptop camera
python live_detection.py --camera 1  # External USB camera
```

## 🛠️ Troubleshooting

### "Module not found: ultralytics"
```bash
pip install ultralytics torch torchvision
```

### "Cannot open camera 0"
```bash
# Try different camera index
python live_detection.py --camera 1

# Windows: Check Settings → Privacy → Camera
```

### "Connection refused: http://localhost:3000"
```bash
# Verify backend is running
curl http://localhost:3000/health

# If not running, start it:
cd backend && npm start
```

### "Model not found: ./models/best.pt"
```bash
# Check path exists
dir "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\"

# Copy model if missing:
copy "C:\path\to\your\best.pt" "d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\best.pt"
```

### No alerts even with animals
```bash
# Lower confidence threshold
python live_detection.py --confidence 0.3

# Verify model classes match your animals
python -c "from ultralytics import YOLO; m = YOLO('./models/best.pt'); print(m.names)"
```

## 📈 Performance Notes

| Setting | FPS | Memory | Accuracy |
|---------|-----|--------|----------|
| Confidence 0.95 | ⚡ High | Low | Few detections |
| Confidence 0.5 | ✓ Balanced | Balanced | Good |
| Confidence 0.3 | 🐢 Lower | High | More detections |

**Recommendation:** Start with `--confidence 0.5` for best balance.

## 📚 Full Documentation

See [LIVE_DETECTION_GUIDE.md](LIVE_DETECTION_GUIDE.md) for complete documentation including:
- Architecture diagram
- Database schema
- API endpoints
- Advanced usage
- Support & troubleshooting

## ✅ Checklist Before Running

- [ ] `best.pt` model exists in `models/` folder
- [ ] Backend server running: `http://localhost:3000`
- [ ] MongoDB Atlas connection configured
- [ ] Cloudinary credentials in backend `.env`
- [ ] Webcam is accessible
- [ ] Python 3.8+ with dependencies installed
- [ ] No other app is using the camera

## 🎯 Success Criteria

After running, you should see:

1. ✅ Model loads in 4-6 seconds
2. ✅ Camera opens and shows dimensions
3. ✅ Frames are processed (every 5 frames)
4. ✅ When animal appears: Terminal alert with class + confidence
5. ✅ Video clip captured and sent to backend
6. ✅ Backend returns HTTP 201 (Created)
7. ✅ Detection appears in MongoDB Atlas

Once all checkmarks pass, your live detection system is working! 🎉

---

**Next:** Check MongoDB Atlas to see recorded detections with video URLs.
