import Detection from "../model/detectionModel.js";
import cloudinary from "../config/cloudinary.js";

// CREATE DETECTION
export const createDetection = async (req, res) => {
  try {
    const {
      cctv_id,
      animal,
      confidence,
      behavior,
      distance,
      locationName,
      latitude,
      longitude
    } = req.body;

    let videoUrl = "";
    let publicId = "";

    // ✅ If file exists → upload to Cloudinary
    if (req.file) {

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto" // image + video auto detect
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      videoUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    const newDetection = new Detection({
      cctv_id,
      animal,
      confidence,
      behavior,
      distance,
      locationName,
      latitude,
      longitude,
      videoUrl,
      publicId
    });

    await newDetection.save();

    res.status(201).json({
      success: true,
      message: "Detection saved & uploaded to Cloudinary",
      data: newDetection
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// GET ALL DETECTIONS (For Frontend Alert Screen)
export const getAllDetections = async (req, res) => {
  try {
    const detections = await Detection.find().sort({ timestamp: -1 });

    res.status(200).json(detections);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// GET SINGLE DETECTION (Alert Details Page)
export const getSingleDetection = async (req, res) => {
  try {
    const detection = await Detection.findById(req.params.id);

    if (!detection) {
      return res.status(404).json({ message: "Detection not found" });
    }

    res.status(200).json(detection);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};