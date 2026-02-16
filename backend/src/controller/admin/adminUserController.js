import Report from "../../model/report.js";
import User from "../../model/User.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "admin" }   // admin exclude
    }).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNgoUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "ngo"
    }).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCitizenUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "citizen"
    }).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBlacklist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlacklisted = !user.isBlacklisted;
    await user.save();

    res.json({
      success: true,
      message: "User status updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL BLACKLISTED ACCOUNTS
export const getBlacklistedAccounts = async (req, res) => {
  try {
    const users = await User.find({
      isBlacklisted: true,
      role: { $ne: "admin" },
    }).select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UNBLACKLIST USER
export const unblacklistUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlacklisted: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User unblacklisted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAdminDashboardStats = async (req, res) => {
  try {
    // Total Reports
    const totalReports = await Report.countDocuments();

    // Ongoing rescues (Accepted + InProgress)
    const ongoingRescues = await Report.countDocuments({
      status: { $in: ["Accepted", "InProgress"] },
    });

    // Completed rescues
    const completedRescues = await Report.countDocuments({
      status: "Complete",
    });

    // Blacklisted users
    const blacklistedUsers = await User.countDocuments({
      isBlacklisted: true,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        ongoingRescues,
        completedRescues,
        blacklistedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
