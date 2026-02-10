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


// import Report from "../model/report.js";
// import Notification from "../model/notification.js";
// import User from "../model/user.js";
// import cloudinary from "../config/cloudinary.js";


// // ✅ CREATE REPORT + NGO NOTIFICATION
// export const createReport = async (req, res) => {
//   try {
//     const {
//       incidentDate,
//       address,
//       latitude,
//       longitude,
//       animalType,
//       behavior,
//       injured,
//       humanHarm,
//     } = req.body;

//     let imageUrl = null;

//     // Upload image to cloudinary
//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload(
//         `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
//         { folder: "reports" }
//       );

//       imageUrl = uploadResult.secure_url;
//     }

//     // Create report
//     const report = await Report.create({
//       user: req.user._id,
//       incidentDate,
//       address,
//       location: {
//         latitude,
//         longitude,
//       },
//       animalType,
//       behavior,
//       injured,
//       humanHarm,
//       image: imageUrl,
//       status: "pending",
//     });

//     // 🔥 Notify all NGOs
//     const ngos = await User.find({ role: "ngo" });

//     const notifications = ngos.map((ngo) => ({
//       receiver: ngo._id,
//       report: report._id,
//       message: "New animal incident reported",
//     }));

//     await Notification.insertMany(notifications);

//     res.status(201).json({
//       success: true,
//       message: "Report created successfully",
//       report,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ USER REPORTS
// export const getMyReports = async (req, res) => {
//   try {
//     const reports = await Report.find({ user: req.user._id })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: reports.length,
//       reports,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ ALL REPORTS (ADMIN/NGO)
// export const getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find()
//       .populate("user", "name email")
//       .populate("acceptedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: reports.length,
//       reports,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ SINGLE REPORT
// export const getReportById = async (req, res) => {
//   try {
//     const report = await Report.findById(req.params.id)
//       .populate("user", "name email")
//       .populate("acceptedBy", "name email");

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     res.status(200).json({
//       success: true,
//       report,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// ✅ NGO ACCEPT REPORT
export const acceptReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res.status(404).json({ message: "Report not found" });

    // Already accepted check
    if (report.status === "accepted") {
      return res.status(400).json({
        message: "Already accepted by another NGO",
      });
    }

    report.status = "accepted";
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