import Report from "../model/report.js";
import cloudinary from "../config/cloudinary.js";


export const createReport = async (req, res) => {
  try {
    const {
      incidentDate,
      address,
      latitude,
      longitude,
      animalType,
      behavior,
      injured,
      humanHarm,
    } = req.body;

    let imageUrl = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "reports",
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    const report = await Report.create({
      user: req.user._id,
      incidentDate,
      address,
      location: {
        latitude,
        longitude,
      },
      animalType,
      behavior,
      injured,
      humanHarm,
      image: imageUrl, // 🔥 Cloudinary URL
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteFakeReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only delete if Fake
    if (report.adminStatus !== "Fake") {
      return res.status(400).json({
        message: "Only fake reports can be deleted",
      });
    }

    await report.deleteOne();

    res.json({
      message: "Fake report deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminStatus = async (req, res) => {
  try {
  
    const { adminStatus } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ message: "Report not found" });

    report.adminStatus = adminStatus;
    await report.save();

    res.status(200).json({
      success: true,
      message: "Admin status updated",
      report,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("user", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const acceptReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res.status(404).json({ message: "Report not found" });

    // Already accepted check
    if (report.status === "Accepted") {
      return res.status(400).json({
        message: "Already accepted by another NGO",
      });
    }

    report.status = "Accepted";   // ✅ FIXED
    report.acceptedBy = req.user._id;

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report accepted successfully",
      report,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ NGO ACCEPTED REPORTS
export const getAcceptedReports = async (req, res) => {
  try {
    const reports = await Report.find({
      acceptedBy: req.user._id,
    })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      reports,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("report")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReportsByRadius = async (req, res) => {
  try {
    let { latitude, longitude, radius } = req.query;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    radius = parseFloat(radius);

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({
        message: "Latitude, Longitude and Radius are required",
      });
    }

    const reports = await Report.find({
      adminStatus: "Pending",  // adjust if needed
      status: "Pending",
      acceptedBy: null,
      "location.latitude": {
        $gte: latitude - radius / 111000,
        $lte: latitude + radius / 111000,
      },
      "location.longitude": {
        $gte: longitude - radius / 111000,
        $lte: longitude + radius / 111000,
      },
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAcceptedReport = async (req, res) => {
  try {
    const { status, description, veterinaryNotes } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // ✅ Only NGO who accepted can update
    if (
      !report.acceptedBy ||
      report.acceptedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this report",
      });
    }

    // ✅ Upload Multiple Files
    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "report-updates" }
        );

        mediaUrls.push(uploadResult.secure_url);
      }
    }

    // ✅ If update already exists → overwrite it
    if (report.updates.length > 0) {
      report.updates[0] = {
        status,
        description,
        veterinaryNotes,
        media: mediaUrls,
        updatedAt: new Date(),
      };
    } else {
      // First time create
      report.updates.push({
        status,
        description,
        veterinaryNotes,
        media: mediaUrls,
      });
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};