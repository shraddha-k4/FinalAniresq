import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import cloudinary from "../config/cloudinary.js";
import { sendOTPEmail } from "../helpers/email.js";

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobileno,
      role,
      address = {},
      regiid,
      mission,
      aboutus
    } = req.body || {};

    const { latitude, longitude } = address;

    // ---------- VALIDATION ----------
    if (!name || !email || !password || !mobileno) {
      return res.status(400).json({ message: "Name, email, password, mobile are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (!/^\d{10}$/.test(mobileno)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    if (
      latitude &&
      (latitude < -90 || latitude > 90)
    ) {
      return res.status(400).json({ message: "Invalid latitude" });
    }

    if (
      longitude &&
      (longitude < -180 || longitude > 180)
    ) {
      return res.status(400).json({ message: "Invalid longitude" });
    }


    // ---------- CHECK EXISTING USER ----------
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!role || !["citizen", "ngo","admin"].includes(role.toLowerCase())) {
  return res.status(400).json({ message: "Valid role is required" });
}


    // ---------- HASH PASSWORD ----------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------- IMAGE UPLOAD (ONLY IMAGE CHANGE) ----------
    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "users" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // ---------- CREATE USER ----------
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobileno,
      role:role.toLowerCase(),
      address: {
      latitude: latitude || null,
      longitude: longitude || null,},
      image: imageUrl,   // ✅ user-uploaded image URL
      regiid,
      aboutus,
      mission
    });

    // ---------- GENERATE JWT ----------
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ---------- RESPONSE ----------
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileno: newUser.mobileno,
        role: newUser.role,
        address: newUser.address,
        image: newUser.image
      }
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileno: user.mobileno,
        role: user.role,
        address: user.address,
        image: user.image
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 1️⃣ Forgot Password → Send OTP
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 2️⃣ Verify OTP → Auto Login (JWT)
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.otp || !user.otpExpiry) return res.status(400).json({ message: "OTP not requested" });
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

        // OTP correct → generate JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Clear OTP
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({
          message: "OTP verified, login successful",
          token,
          user: {
            id: user._id,
            role: user.role,
            email: user.email,
          },
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};



export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};


export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      mobileno,
      address = {},
      aboutus,
      mission,
      regiid,
      } = req.body || {};

    const { latitude, longitude } = address;


    // ---------- VALIDATION ----------
    if (mobileno && !/^\d{10}$/.test(mobileno)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
  return res.status(400).json({ message: "Invalid latitude" });
}

if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
  return res.status(400).json({ message: "Invalid longitude" });
}


      const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ---------- IMAGE UPDATE ----------
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "users" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      user.image = result.secure_url;
    }

    // ---------- UPDATE FIELDS ----------
    if (name) user.name = name;
    if (mobileno) user.mobileno = mobileno;
    if (aboutus) user.aboutus = aboutus;
    if (mission) user.mission = mission;
    if (regiid) user.regiid = regiid;

     user.address = {
  latitude: latitude ?? user.address?.latitude,
  longitude: longitude ?? user.address?.longitude,
};



    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileno: user.mobileno,
        role: user.role,
        address: user.address,
        image: user.image,
        aboutus: user.aboutus,
        mission: user.mission,
        regiid:user.regiid,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// // GET ALL NGOs
// export const getAllNGOs = async (req, res) => {
//   try {
//     const ngos = await User.find({ role: "ngo" }).select("-password");

//     if (!ngos.length) {
//       return res.status(404).json({ message: "No NGOs found" });
//     }

//     res.status(200).json({
//       message: "NGOs fetched successfully",
//       count: ngos.length,
//       ngos,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
// GET ALL NGOs (exclude blacklisted)
export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({
      role: "ngo",
      isBlacklisted: false, // 👉 blacklisted exclude
    }).select("-password");

    if (!ngos.length) {
      return res.status(404).json({ message: "No NGOs found" });
    }

    res.status(200).json({
      message: "NGOs fetched successfully",
      count: ngos.length,
      ngos,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------- GET ALL USERS (Public Access) ----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpiry");

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "All users fetched successfully",
      count: users.length,
      users,
    });

  } catch (error) {
    console.log("Get All Users Error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};