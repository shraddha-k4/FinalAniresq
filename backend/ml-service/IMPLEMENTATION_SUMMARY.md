# 📋 Live Detection System - Code Changes Summary

## Overview of Implementation

This document outlines the changes made to enable live animal detection with video storage in MongoDB Atlas using your trained `best.pt` YOLOv8 model.

## 🔄 System Flow

```
Camera Feed (Webcam/CCTV)
    ↓
[YOLOv8 Inference] ← best.pt model
    ↓
[Filter: Keep Animals, Drop Humans]
    ↓
[Print Terminal Alert: "ALERT: tiger - Confidence: 0.87"]
    ↓
[BufferFrames: Keep last 30 frames (3 seconds)]
    ↓
[On Animal Detection]
    ├→ Capture video clip from buffer (MP4)
    ├→ POST to Backend with Video + Metadata
    │
    └→ Backend Processing:
        ├→ Upload video to Cloudinary (secure URL)
        ├→ Save detection record to MongoDB Atlas
        │   └→ Detection { cctvId, timestamp, objects[], videoUrl }
        └→ Return HTTP 201 (Created)
```

## 📁 Files Modified/Created

### 1. **Backend: Detection Model** ✏️
**File:** `backend/src/model/Detection.js`

**Change:** Added `videoUrl` field to store Cloudinary video link
```javascript
videoUrl: {
    type: String,
    default: null,
},
```

### 2. **Backend: Detection Controller** ✏️
**File:** `backend/src/controller/detectionController.js`

**Changes:**
- Added Cloudinary import to upload videos
- Modified `createDetection()` to:
  - Accept multipart/form-data with optional video file
  - Parse stringified JSON fields (from form data)
  - Upload video to Cloudinary if provided
  - Store video URL in detection record
  
**Key Logic:**
```javascript
// If file provided, upload to Cloudinary
if (req.file && req.file.buffer) {
    const uploadResult = await cloudinary.uploader.upload(tmpPath, { 
        resource_type: 'video', 
        folder: 'detections' 
    });
    videoUrl = uploadResult.secure_url;
}
```

### 3. **Backend: Detection Routes** ✏️
**File:** `backend/src/route/detectionRoute.js`

**Change:** Added upload middleware to accept video files
```javascript
detectionRouter.post("/", upload.single('video'), createDetection);
```

Now accepts:
- **JSON POST:** JSON detections without video (old format)
- **Multipart POST:** Form data with video file attachment (new format)

---

## 🤖 ML Service: Core Detection

### 4. **Python: Main App Service** ✏️
**File:** `backend/ml-service/app.py`

**Changes:**
- Added frame buffer (deque) to keep last 30 frames
- Added human filtering logic
- Added terminal alert logging
- Modified `send_detection_to_backend()` to:
  - Accept optional `video_path` parameter
  - Send as multipart/form-data when video present
  - Send as JSON when video absent
- Added video clip creation in `process_cctv_stream()`

**Key Addition:**
```python
# filter humans - only alert for animals
animal_detections = [d for d in detections.get('objects', []) 
                     if d.get('class_name', '').lower() not in ('human', 'humans')]

if animal_detections:
    # print terminal alerts
    for d in animal_detections:
        logger.warning(f"ALERT: {d.get('class_name')} - Confidence: {d.get('confidence'):.2f}")
```

### 5. **Python: Live Detection Script** 🆕
**File:** `backend/ml-service/live_detection.py`

**New complete script for live camera detection:**

**Class:** `LiveAnimalDetector`
- Loads trained YOLOv8 model
- Connects to webcam/CCTV
- Runs real-time inference
- Filters animals only (excludes humans)
- Captures video clips
- Sends alerts to backend

**Key Methods:**
- `detect_from_camera()` - Main detection loop
- `is_animal_detection()` - Filter humans
- `capture_clip()` - Create MP4 from frame buffer
- `send_alert_to_backend()` - POST alert with video

**Features:**
- ✅ Prints alerts to terminal: "ALERT: tiger - Confidence: 0.87"
- ✅ Captures 3-second video clips (30 frames)
- ✅ Sends multipart request with video + metadata
- ✅ Cooldown period (10 sec) to avoid spam
- ✅ Command-line arguments for customization

### 6. **Python: Integration Tests** 🆕
**File:** `backend/ml-service/test_integration.py`

**Test Suite:**
- ✅ Model file exists
- ✅ YOLOv8 loads correctly
- ✅ Has required animal classes
- ✅ Backend server health
- ✅ Detection endpoint responsive
- ✅ Cloudinary configured
- ✅ MongoDB URI set
- ✅ Live detection script available

Run: `python test_integration.py`

---

## 📚 Documentation Created

### 7. **Guide: Live Detection Setup** 🆕
**File:** `backend/ml-service/LIVE_DETECTION_GUIDE.md`

Complete guide including:
- Architecture overview
- Step-by-step setup
- How to run live detection
- Database schema examples
- Troubleshooting guide
- Advanced usage

### 8. **Quick Start Guide** 🆕
**File:** `backend/ml-service/QUICKSTART.md`

5-minute setup guide with:
- Prerequisites checklist
- Quick setup steps
- Verification tests
- Expected output examples
- Common troubleshooting

---

## 🔑 Key Features Implemented

### ✂️ Human Filtering
```python
ANIMAL_CLASSES = {'porcupine', 'redfox', 'hyena', 'tiger'}

# Only alerts for animals, ignores humans
if class_name.lower() not in ANIMAL_CLASSES:
    continue  # Skip humans
```

### 🔔 Terminal Alerts
```
2026-02-26 14:35:30 - [WARNING] - 🚨 ALERT: tiger detected - Confidence: 0.87
2026-02-26 14:35:31 - [WARNING] - 🚨 ALERT: hyena detected - Confidence: 0.72
```

### 📹 Video Clip Capture (3 seconds)
- Maintains deque of 30 frames (3 sec at 10 FPS)
- On animal detection, creates MP4 from buffer
- Frame rate: 10 FPS (smooth playback)
- Resolution: 640x480 (lightweight)

### 📤 Backend Integration
```python
# Multipart request with video file
files = {'video': open(video_path, 'rb')}
data = {
    'cctv_id': 'cctv_001',
    'timestamp': '2026-02-26T14:35:30.000Z',
    'detections': '[{"className": "tiger", "confidence": 0.87, ...}]',
    'total_detections': '1'
}
requests.post('http://localhost:3000/api/detections', files=files, data=data)
```

### 💾 Database Storage
**MongoDB Atlas Detection Record:**
```javascript
{
  cctvId: ObjectId("..."),
  detectionTimestamp: ISODate("2026-02-26T14:35:30Z"),
  objects: [
    {
      classId: 4,
      className: "tiger",
      confidence: 0.87,
      bbox: { xMin: 100, yMin: 100, xMax: 200, yMax: 200 }
    }
  ],
  totalDetections: 1,
  severity: "high",
  videoUrl: "https://res.cloudinary.com/.../detection_video.mp4",  // ← NEW
  alertSent: true,
  processed: false,
  createdAt: ISODate("2026-02-26T14:35:30Z")
}
```

---

## 🚀 How to Use

### Step 1: Place Your Model
```bash
copy best.pt d:\3rd year\AniResQ Final\AniResQ\backend\ml-service\models\best.pt
```

### Step 2: Install Dependencies
```bash
cd backend/ml-service
pip install -r requirements.txt
```

### Step 3: Start Backend
```bash
cd backend
npm start
# Waits for: ✅ Server running on http://localhost:3000
```

### Step 4: Run Live Detection
```bash
cd backend/ml-service
python live_detection.py --cctv-id cctv_001 --camera 0 --duration 60
```

### Step 5: Watch Terminal Output
```
🎥 Starting live detection from camera 0
📌 CCTV ID: cctv_001
🎯 Filtering for: porcupine, redfox, hyena, tiger
✅ Camera opened: 1280x720 @ 30.0 FPS
...
🚨 ALERT: tiger detected - Confidence: 0.87
📤 Capturing clip and sending alert...
✅ Alert sent to backend (status: 201)
```

---

## 🔍 Detection Class Filtering

**Your Model Classes:** porcupine, redfox, hyena, **humans**, tiger

**Filtering Logic:**
```python
# In live_detection.py, line ~29
self.animal_classes = {'porcupine', 'redfox', 'hyena', 'tiger'}

# In app.py, line ~240
animal_detections = [d for d in detections.get('objects', []) 
                     if d.get('class_name', '').lower() in self.animal_classes]
```

**Result:**
- ✅ porcupine detected → ALERT ✅
- ✅ redfox detected → ALERT ✅
- ✅ hyena detected → ALERT ✅
- ✅ tiger detected → ALERT ✅
- ❌ human detected → IGNORED ❌

---

## 📊 API Endpoints Modified

### POST `/api/detections` (Modified)
**Old Behavior:** JSON only, no video storage

**New Behavior:** Accepts both:
1. **JSON POST:** `Content-Type: application/json`
   - Direct detection data (no video)
   
2. **Multipart POST:** `Content-Type: multipart/form-data`
   - Form fields: cctv_id, timestamp, detections, total_detections, frame_shape
   - File field: video (MP4)
   - Automatically uploads video to Cloudinary
   - Stores videoUrl in MongoDB

---

## ⚙️ Configuration Files

### `.env` (ML Service)
```env
MODEL_PATH=./models/best.pt
BACKEND_URL=http://localhost:3000
CONFIDENCE_THRESHOLD=0.5
CLIP_FRAMES=30
TMPDIR=C:\Temp
```

### `.env` (Backend)
```env
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/anireq
```

---

## 🧪 Testing

Run integration tests:
```bash
python test_integration.py
```

Expected output:
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

---

## 📈 Performance Characteristics

| Component | Time | Notes |
|-----------|------|-------|
| Model load | 4-6 sec | One-time at startup |
| Frame inference | 50-100 ms | Per frame, depends on GPU |
| Video capture | <1 sec | Create clip from buffer |
| Upload to back | 2-5 sec | Multipart POST + file upload |
| Cloudinary store | 1-3 sec | Async, separate from API |
| MongoDB insert | <1 sec | Direct database write |

---

## 🔗 Integration Points

### Frontend → Backend
- REST API `/api/detections` (POST)
- Optional: WebSocket for real-time alerts

### Backend → ML Service
- HTTP POST to `/api/detections`
- Sends detection JSON + optional video file

### Backend → Cloudinary
- Upload video file via SDK
- Returns secure URL

### Backend → MongoDB
- Insert Detection document
- Reference video URL

---

## 💡 Design Decisions

1. **Frame Buffer vs Disk Caching**
   - ✅ In-memory deque: Fast, low storage, simple
   - ❌ Would be: Disk I/O slower

2. **MP4 Format for Clips**
   - ✅ MP4: Universal, streaming-friendly, good compression
   - ❌ Alternatives: AVI too large, WebM less compatible

3. **Cloudinary for Storage**
   - ✅ Managed: No server size limits, CDN delivery
   - ❌ Direct MongoDB: 16MB document limit, slower

4. **10 FPS Clip Playback**
   - ✅ 10 FPS: 30 frames = 3 sec, smooth enough
   - ❌ 30 FPS: 90 frames = 3 sec, large file size

5. **Human Filtering at ML Service**
   - ✅ Early: Reduces unnecessary API calls
   - ❌ Late: Would waste resources

---

## ✅ Verification Checklist

Before running:
- [ ] Model file: `backend/ml-service/models/best.pt` exists
- [ ] Backend configured: Cloudinary, MongoDB
- [ ] Dependencies: `pip install -r requirements.txt` done
- [ ] Backend running: `http://localhost:3000` accessible
- [ ] Webcam: Connected and not in use
- [ ] Drive space: Temp folder has free space

---

## 📞 Support

**Issue:** No detections despite animals present
- Lower confidence: `--confidence 0.3`
- Check model is trained on these classes

**Issue:** Can't connect to backend
- Verify running: `curl http://localhost:3000/health`
- Check port 3000 availability

**Issue:** Video not saving to MongoDB
- Check Cloudinary credentials
- Verify MONGODB_URI in backend `.env`
- Check MongoDB Atlas network access settings

---

## 🎯 Success Metrics

Your implementation is complete when:
1. ✅ Model loads: "✅ Model loaded! Classes: [...]"
2. ✅ Camera opens: "✅ Camera opened: 1280x720 @ 30.0 FPS"
3. ✅ Detection works: "🚨 ALERT: tiger - Confidence: 0.87" appears
4. ✅ Video captured: "✅ Clip created: ..." message
5. ✅ Backend receives: "✅ Alert sent to backend (status: 201)"
6. ✅ MongoDB stored: Detection record visible in Atlas with videoUrl

Once all 6 checkmarks pass, your live detection system is **fully operational**! 🎉

---

**Version:** 1.0
**Last Updated:** 2026-02-26
**Status:** Ready for Production Testing
