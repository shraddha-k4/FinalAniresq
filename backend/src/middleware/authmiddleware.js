
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 DB madhun FULL USER load kara
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ FULL user object
    next();

  } catch (error) {
    console.log("Auth middleware error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

