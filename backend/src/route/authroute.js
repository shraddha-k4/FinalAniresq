import express from "express";
import { forgotPassword, getAllNGOs, getMyProfile, login, signup, updateMyProfile, verifyOTP } from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/upload.js";


const authrouter = express.Router();

// authrouter.post("/signup", signup);
authrouter.post("/signup", upload.single("image"), signup);

authrouter.post("/login", login);

// Forgot Password → Send OTP
authrouter.post("/forgotpassword", forgotPassword);

// Verify OTP → Auto Login
authrouter.post("/verifyotp", verifyOTP);
//get profile
authrouter.get("/getProfile",authMiddleware,getMyProfile);
//update profile
authrouter.put("/updateprofile",authMiddleware,upload.single("image"),updateMyProfile);
//get all ngo 
authrouter.get("/ngos",authMiddleware, getAllNGOs);
// Protected route example
authrouter.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to profile",
    userId: req.user.id
  });
});

export default authrouter;

