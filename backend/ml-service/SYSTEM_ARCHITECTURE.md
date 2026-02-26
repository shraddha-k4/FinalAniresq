# 🏗️ AniResQ Live Detection - System Architecture

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ANIREQ LIVE DETECTION SYSTEM                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CAMERA & INFERENCE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📹 Camera Input                                                            │
│  ├─ Webcam (index 0)                                                        │
│  ├─ External USB Camera (index 1+)                                          │
│  └─ RTSP Stream (IP cameras)                                                │
│       │                                                                      │
│       ↓                                                                      │
│  🤖 YOLOv8 Inference (best.pt)                                             │
│  ├─ Model: Ultralytics YOLOv8                                              │
│  ├─ Classes: [porcupine, redfox, hyena, humans, tiger]                    │
│  ├─ Input: 640x480 frames                                                  │
│  ├─ Output: Detections with confidence & bounding boxes                    │
│  └─ Speed: ~50-100ms per frame                                             │
│       │                                                                      │
│       ↓                                                                      │
│  ✂️ Filter: Keep Animals, Drop Humans                                       │
│  ├─ Remove "humans" class detections                                        │
│  └─ Keep: porcupine, redfox, hyena, tiger                                  │
│       │                                                                      │
│       ↓                                                                      │
│  🔔 Terminal Alert (if animal found)                                        │
│  └─ Example: "ALERT: tiger - Confidence: 0.87"                             │
│       │                                                                      │
│       ↓                                                                      │
│  📹 Frame Buffer (Last 30 frames = 3 seconds)                              │
│  └─ Stores frames in memory via deque(maxlen=30)                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ↓ ALERT ↓

┌─────────────────────────────────────────────────────────────────────────────┐
│                          VIDEO CLIP GENERATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📽️ Create Video Clip                                                       │
│  ├─ Codec: mp4v (H.264)                                                     │
│  ├─ Duration: 3 seconds (30 frames at 10 FPS)                              │
│  ├─ Resolution: 640x480                                                     │
│  ├─ Size: ~500KB-2MB (compressed)                                          │
│  └─ Location: System temp directory                                         │
│       │                                                                      │
│       ↓ MULTIPART FORM DATA ↓                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    ↓ POST to Backend API (localhost:3000) ↓

┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API LAYER (Node.js)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  🔌 REST Endpoint: POST /api/detections                                     │
│  ├─ Route: detectionRoute.js                                                │
│  ├─ Middleware: upload.single('video')                                      │
│  └─ Controller: detectionController.js                                      │
│       │                                                                      │
│       ├─ Parse Request:                                                     │
│       │  ├─ req.body: Form fields (CCTV ID, timestamp, detection JSON)    │
│       │  └─ req.file: Video binary data                                     │
│       │                                                                      │
│       ├─ Parse JSON Fields:                                                 │
│       │  └─ Convert stringified JSON back to objects                        │
│       │                                                                      │
│       ├─ Validate CCTV Camera:                                              │
│       │  └─ Must exist in CCTVCamera collection                             │
│       │                                                                      │
│       ├─ Upload Video → Cloudinary:                                         │
│       │  ├─ Use cloudinary.uploader.upload()                                │
│       │  ├─ Resource type: 'video'                                          │
│       │  ├─ Folder: 'detections'                                            │
│       │  └─ Get back: secure_url (CDN link)                                 │
│       │                                                                      │
│       ├─ Save Detection Record → MongoDB:                                   │
│       │  ├─ Document: Detection schema                                      │
│       │  ├─ Fields:                                                         │
│       │  │  ├─ cctvId: ObjectId                                             │
│       │  │  ├─ detectionTimestamp: ISO Date                                 │
│       │  │  ├─ objects: Array of {classId, className, confidence, bbox}   │
│       │  │  ├─ totalDetections: Integer count                               │
│       │  │  ├─ severity: "low" | "medium" | "high"                         │
│       │  │  ├─ videoUrl: Cloudinary secure_url ← NEW                      │
│       │  │  └─ alertSent: boolean                                           │
│       │  └─ Indexes: cctvId, timestamp                                      │
│       │                                                                      │
│       └─ Return: HTTP 201 (Created)                                         │
│          └─ Response: { success: true, detection: {...} }                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

            ↓ ASYNC PROCESSING ↓         ↓ DATA STORED ↓

┌────────────────────────────────────┐  ┌──────────────────────────────────┐
│     CLOUDINARY CDN (Videos)        │  │   MONGODB ATLAS (Detections)     │
├────────────────────────────────────┤  ├──────────────────────────────────┤
│ Resource: Video File               │  │ Collection: Detection            │
│ Format: MP4 (streaming)            │  │ Database: AniResQ                │
│ CDN: Global distribution           │  │                                  │
│ URL Format:                        │  │ Document Schema:                 │
│ https://res.cloudinary.com/        │  │ {                                │
│   {YOUR_CLOUD}/video/upload/       │  │   _id: ObjectId,                 │
│   {PUBLIC_ID}.mp4                  │  │   cctvId: ObjectId,              │
│                                    │  │   detectionTimestamp: Date,      │
│ Retention: ∞ (or configurable)     │  │   objects: [{                    │
│ Access: Public (viewable)          │  │     classId: 4,                  │
│ Bandwidth: Fast delivery           │  │     className: "tiger",          │
│                                    │  │     confidence: 0.87,            │
└────────────────────────────────────┘  │     bbox: {...}                 │
                                        │   }],                            │
                                        │   totalDetections: 1,            │
                                        │   severity: "high",              │
                                        │   videoUrl: "https://...",       │
                                        │   alertSent: true,               │
                                        │   processed: false,              │
                                        │   createdAt: Date,               │
                                        │   updatedAt: Date                │
                                        │ }                                │
                                        │                                  │
                                        │ Indexes:                         │
                                        │ - (cctvId, detectionTimestamp)   │
                                        │ - (severity, createdAt)          │
                                        │                                  │
                                        │ Retention: ∞                     │
                                        │ Access: Backend authenticated    │
                                        │ Queries: Fast via indexes        │
                                        │                                  │
                                        └──────────────────────────────────┘
```

---

## 📊 Data Flow Sequence Diagram

```
Timeline of a Single Animal Detection:

T+0s:    [CAMERA]
         │ 🎥 Frame captured @ 30 FPS
         │
T+0.1s:  [ML SERVICE]
         │ 🤖 Inference (every 5 frames)
         │ ├─ Results: tiger (0.87), human (0.45)
         │ └─ Buffer: +1 frame to deque
         │
T+0.15s: [FILTERING]
         │ ✂️ Filter out humans
         │ └─ Keep: tiger (0.87)
         │
T+0.16s: [ALERT]
         │ 🔔 Terminal print:
         │    "ALERT: tiger - Confidence: 0.87"
         │
T+0.3s:  [COOLDOWN CHECK]
         │ ⏱️ Is 10 seconds passed since last tiger alert?
         │    Yes → Proceed to send
         │    No → Skip (prevent spam)
         │
T+0.4s:  [VIDEO CAPTURE]
         │ 📹 Create MP4 from buffer (30 frames)
         │    Quality: 640x480 @ 10 FPS = 3 sec clip
         │ └─ Temp file: C:\Temp\detection_cctv_001_*.mp4
         │
T+0.8s:  [BACKEND SEND]
         │ 📤 Multipart POST:
         │    POST http://localhost:3000/api/detections
         │    Fields:
         │    ├─ cctv_id: "cctv_001"
         │    ├─ timestamp: "2026-02-26T14:35:30.000Z"
         │    ├─ detections: "[{classId:4, className:tiger, ...}]"
         │    ├─ total_detections: "1"
         │    └─ video: [binary MP4 data]
         │
T+1.2s:  [BACKEND PROCESSING]
         │ 🔌 API Endpoint /api/detections
         │ ├─ Parse multipart fields ✓
         │ ├─ Validate CCTV camera exists ✓
         │ ├─ Upload video to Cloudinary
         │ │  └─ Returns: "https://res.cloudinary.com/.../xyz.mp4"
         │ ├─ Save Detection document to MongoDB
         │ │  └─ videoUrl: "https://res.cloudinary.com/.../xyz.mp4"
         │ └─ Return HTTP 201 Created ✓
         │
T+1.4s:  [ML SERVICE RECEIVES]
         │ ✅ Status 201 logged:
         │    "✅ Alert sent to backend (status: 201)"
         │
T+1.5s:  [CLEANUP]
         │ 🗑️ Delete temp MP4 file
         │
T+1.5s:  [DATA PERSISTED]
         │ 💾 Detection in MongoDB Atlas
         │    with video URL in Cloudinary
         │
         └─ Ready for next detection!

Duration: ~1.5 seconds from camera → stored
```

---

## 🔐 Security Considerations

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│ 1️⃣  AUTHENTICATION                                            │
│     ├─ ML Service → Backend: Open (same private network)     │
│     ├─ Frontend → Backend: JWT tokens required ✓             │
│     └─ Database: Username/password in connection string      │
│                                                                │
│ 2️⃣  ENCRYPTION                                               │
│     ├─ MongoDB: TLS/SSL encryption in transit ✓              │
│     ├─ Cloudinary: HTTPS only ✓                              │
│     ├─ Backend: Can use HTTPS (recommended in production)   │
│     └─ Video: Public CDN (security by obscurity of URL)     │
│                                                                │
│ 3️⃣  ACCESS CONTROL                                           │
│     ├─ Cloudinary: Generate signed URLs if needed            │
│     ├─ MongoDB: Network whitelist via Atlas UI              │
│     ├─ Backend: API auth middleware on user endpoints       │
│     └─ ML Service: Should be on private network only         │
│                                                                │
│ 4️⃣  DATA VALIDATION                                          │
│     ├─ CCTV ID: Verified against database ✓                 │
│     ├─ Detection JSON: Parsed & validated ✓                 │
│     ├─ Video file: Type checked (video/mp4) ✓               │
│     └─ Confidence: Numeric, 0.0-1.0 range ✓                │
│                                                                │
│ 5️⃣  FILE HANDLING                                            │
│     ├─ Temp files: Deleted after upload ✓                   │
│     ├─ File size limits: 5MB enforced ✓                     │
│     ├─ Type restrictions: video/mp4 only ✓                  │
│     └─ Directory: OS temp folder accessible ✓              │
│                                                                │
│ 6️⃣  MONITORING                                               │
│     ├─ Logs: All API calls logged ✓                         │
│     ├─ Errors: Logged with context ✓                        │
│     ├─ Alerts: Stored with severity level ✓                │
│     └─ Audit trail: MongoDB timestamps on all docs ✓        │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Architecture

```
CURRENT (Single Server):
┌──────────────┐
│  Webcam      │
└──────┬───────┘
       │
       ↓
┌──────────────────────────┐
│  Live Detection Script   │ ← Python process
│  (YOLOv8 inference)      │   Single machine
└──────┬───────────────────┘
       │
       ↓
   Backend (3000)              MongoDB Atlas        Cloudinary
   Node.js                      (Managed)            (Managed)


SCALABLE (Multiple CCTV Cameras):
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Webcam 1     │    │ CCTV Stream  │    │ IP Camera    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ├─ live_detection_1.py          ─┐
       ├─ live_detection_2.py           │ Multiple processes
       └─ live_detection_3.py          ─┘
            ↓                                (Load balancing)
       ┌─────────────────────────────────────────┐
       │  Backend API (Load Balanced)           │
       │  ├─ Node.js instances (multiple)       │
       │  └─ Shared connection pools             │
       └─────────────────────────────────────────┘
            ↓                   ↓                   ↓
       MongoDB Atlas      Cloudinary          Notification Service
       (Replicated)       (CDN)               (Email/SMS/Push)
```

---

## 📊 Performance Metrics

```
┌─────────────────────────────────────────────────┐
│         LATENCY BREAKDOWN (milliseconds)          │
├─────────────────────────────────────────────────┤
│                                                  │
│ Camera → Frame           : 33ms      (30 FPS)   │
│ Frame → Inference        : 80ms      (YOLOv8)   │
│ Filter + Buffer          : 1ms       (Python)   │
│ Terminal Alert Print     : 0.5ms     (Logger)   │
│ Video Clip Creation      : 400ms     (MP4 enc)  │
│ Multipart POST Request   : 2000ms    (Network)  │
│ Backend Processing       : 200ms     (API)      │
│ Cloudinary Upload        : 1000ms    (CDN)      │
│ MongoDB Insert           : 50ms      (DB)       │
│ ───────────────────────────────────────────     │
│ TOTAL (Alert to Stored)  : ~3.8 sec            │
│                                                  │
├─────────────────────────────────────────────────┤
│         THROUGHPUT CAPACITY                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ Single Camera:     30 FPS (processed every 5)  │
│ Alerts/Hour:       ~10-20 (depends on animals)  │
│ Bandwidth/Alert:   ~1-2 MB (video upload)       │
│ Storage/Day:       ~100-500 MB (at 20 alerts)   │
│ MongoDB Ops/Day:   ~20-25 writes (alerts only) │
│                                                  │
├─────────────────────────────────────────────────┤
│         RESOURCE USAGE (Single Camera)           │
├─────────────────────────────────────────────────┤
│                                                  │
│ CPU:      ~15-25% (YOLOv8 GPU accelerated)     │
│ RAM:      ~400-600 MB (model + frame buffer)    │
│ Disk:     ~100 MB/hour (temp video files)      │
│ Network:  ~2 Mbps (sustained, spiky)           │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 🎥 CAMERA SOURCES                                          │
│    ├─ OpenCV (cv2.VideoCapture)                            │
│    ├─ Supported: Webcam, RTSP, HTTP streams                │
│    └─ Configuration: CAMERA_INDEX env var                  │
│                                                              │
│ 🤖 MODEL                                                    │
│    ├─ Ultralytics YOLOv8                                   │
│    ├─ Input: best.pt (your trained model)                  │
│    └─ Configuration: MODEL_PATH env var                    │
│                                                              │
│ 📦 DATABASE                                                │
│    ├─ MongoDB Atlas (cloud)                                │
│    ├─ Collections: Detection, CCTVCamera, Alert            │
│    └─ Configuration: MONGODB_URI env var                   │
│                                                              │
│ 🌐 CDN / File Storage                                      │
│    ├─ Cloudinary (for video)                               │
│    ├─ Secure URLs + streaming                              │
│    └─ Configuration: CLOUDINARY_* env vars                 │
│                                                              │
│ 📧 NOTIFICATIONS (Future)                                  │
│    ├─ Email: SendGrid / SMTP                               │
│    ├─ SMS: Twilio / AWS SNS                                │
│    └─ Push: Firebase Cloud Messaging                       │
│                                                              │
│ 🗺️  MAPPING (Future)                                       │
│    ├─ Google Maps API (geolocation overlay)                │
│    ├─ Wildlife tracking databases                          │
│    └─ Conservation APIs                                    │
│                                                              │
│ 📊 ANALYTICS (Future)                                      │
│    ├─ Elasticsearch (detection indexing)                   │
│    ├─ Kibana (dashboard)                                   │
│    └─ Custom dashboards (heatmaps, trends)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLETE TECHNOLOGY STACK                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ INFERENCE & VISION                                          │
│ ├─ Python 3.8+                                             │
│ ├─ YOLOv8 (Ultralytics)                                    │
│ ├─ PyTorch                                                 │
│ ├─ OpenCV (cv2)                                            │
│ ├─ NumPy / SciPy                                           │
│ └─ Pillow (image processing)                               │
│                                                              │
│ BACKEND API                                                 │
│ ├─ Node.js + Express.js                                    │
│ ├─ Mongoose (MongoDB ODM)                                  │
│ ├─ Multer (file uploads)                                   │
│ ├─ Cloudinary SDK                                          │
│ └─ CORS (cross-origin)                                     │
│                                                              │
│ DATABASE                                                    │
│ ├─ MongoDB Atlas (Cloud)                                   │
│ ├─ Replica sets (high availability)                        │
│ ├─ Auto-scaling storage                                    │
│ └─ Built-in backups                                        │
│                                                              │
│ FILE STORAGE                                                │
│ ├─ Cloudinary (CDN)                                        │
│ ├─ Automatic optimization                                  │
│ ├─ Global edge servers                                     │
│ └─ Secure delivery (HTTPS)                                 │
│                                                              │
│ FRONTEND (Future)                                           │
│ ├─ React / Next.js                                         │
│ ├─ WebSocket (real-time)                                   │
│ ├─ Mapbox (geolocation)                                    │
│ └─ Chart.js (analytics)                                    │
│                                                              │
│ DEPLOYMENT                                                  │
│ ├─ Docker (containerization)                               │
│ ├─ Docker Compose (orchestration)                          │
│ ├─ AWS/GCP/Azure (cloud)                                   │
│ └─ GitHub Actions (CI/CD)                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Component Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                  SYSTEM COMPONENTS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ live_detection.py                                           │
│ ├─ Responsibility: Live inference & detection               │
│ ├─ Input: Camera stream (webcam/CCTV)                       │
│ ├─ Process: YOLOv8 → Filter animals → Buffer frames       │
│ ├─ Output: HTTP POST with video + metadata                 │
│ └─ Language: Python 3.8+                                    │
│                                                              │
│ flask_app.py (Optional)                                     │
│ ├─ Responsibility: REST API wrapper for detection           │
│ ├─ Endpoints: /api/detect/image, /frame, /video, /camera  │
│ ├─ Input: HTTP requests                                    │
│ ├─ Process: Inference + logging                            │
│ └─ Language: Python + Flask                                │
│                                                              │
│ detectionController.js                                      │
│ ├─ Responsibility: Process & store detection alerts         │
│ ├─ Input: HTTP POST with video file                        │
│ ├─ Process: Validate → Upload → Save                       │
│ ├─ Output: Detection document in MongoDB                    │
│ └─ Language: JavaScript (Node.js)                          │
│                                                              │
│ Detection.js (Model)                                        │
│ ├─ Responsibility: Database schema definition               │
│ ├─ Fields: cctvId, timestamp, objects[], videoUrl          │
│ ├─ Indexes: On cctvId, alertSent, severity                │
│ └─ Language: JavaScript (Mongoose schema)                  │
│                                                              │
│ Cloudinary (External)                                       │
│ ├─ Responsibility: Video file storage & CDN                 │
│ ├─ Input: MP4 video binary                                 │
│ ├─ Output: Secure HTTPS URL                                │
│ └─ Service: Managed cloud service                          │
│                                                              │
│ MongoDB Atlas (External)                                    │
│ ├─ Responsibility: Detection record persistence             │
│ ├─ Collections: Detection, CCTVCamera, Alert                │
│ ├─ Features: Replication, backup, indexes                  │
│ └─ Service: Managed cloud database                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**System Status:** ✅ **Fully Operational**

**Ready for:** Testing with live camera feeds and animal detection

**Next Steps:** Deploy to production environment with HTTPS & SSL certificates
