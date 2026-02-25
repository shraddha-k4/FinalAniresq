import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const VolunteerRequest =
  mongoose.models.VolunteerRequest ||
  mongoose.model("VolunteerRequest", volunteerRequestSchema);

export default VolunteerRequest;