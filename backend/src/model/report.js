import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    incidentDate: Date,

    address: String,

    location: {
      latitude: Number,
      longitude: Number,
    },

    animalType: {
      type: String,
      enum: ["pet", "wild", "stray"],
    },

    behavior: {
      type: String,
      enum: ["aggressive", "normal", "unknown"],
    },

    injured: {
      type: String,
      enum: ["yes", "no", "unknown"],
    },

    humanHarm: {
      type: String,
      enum: ["injured", "no", "death"],
    },

    image: {
      type: String, // image path
    },

    
    status: {
      type: String,
      enum: ["pending", "accepted", "resolved"],
      default: "pending",
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // NGO user
      default: null,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
