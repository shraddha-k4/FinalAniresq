import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  cctv_id: String,
  animal: String,
  confidence: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
  behavior: String,
  distance: Number,
  locationName: String,
  latitude: Number,
  longitude: Number,
  videoUrl: String,
  status: {
    type: String,
    default: "Critical Alert"
  }
});

export default mongoose.model("Detection", detectionSchema);