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
    aiDetection: {
    inferenceId: String,
    detectedAnimal: String,
    inferenceTime: Number,
    imageSize: {
      width: Number,
      height: Number,
    },
  },
    aiCare: Object,
    image: {
      type: String, // image path
    },  
    
   status: {
      type: String,
      enum: ["Pending", "Accepted"],
      default: "Pending",
    },
    adminStatus: {
      type: String,
      enum: ["Pending", "True", "Fake"],
      default: "Pending",
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // NGO user
      default: null,
    },


    // ✅ NEW FIELD ADDED (NGO Case Updates History)
    updates: [
      {
        status: {
          type: String,
          enum: ["In Treatment", "Recovery", "Completed"],
        },

        description: {
          type: String,
        },

        veterinaryNotes: {
          type: String,
        },

        media: [
          {
            type: String, // Cloudinary URLs
          },
        ],

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);

