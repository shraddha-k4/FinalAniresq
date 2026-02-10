import express from "express";
import {
  
  getMyReports,
  getAllReports,
  getReportById,
  acceptReport,
  getAcceptedReports,
  createReport,
} from "../controller/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create report
router.post("/create",authMiddleware,upload.single("image"),createReport);

// User reports
router.get("/my", authMiddleware, getMyReports);

// All reports
router.get("/all", authMiddleware, getAllReports);

// Single report
router.get("/:id", authMiddleware, getReportById);

// NGO accept report
router.put("/accept/:id", authMiddleware, acceptReport);

// NGO accepted reports
router.get("/accepted/list", authMiddleware, getAcceptedReports);

export default router;
