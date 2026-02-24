import express from "express";
import {
  
  getMyReports,
  getAllReports,
  getReportById,
  acceptReport,
  getAcceptedReports,
  createReport,
  getReportsByRadius,
  updateAcceptedReport,
} from "../controller/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create report
router.post("/create",upload.single("image"),authMiddleware,createReport);

// User reports
router.get("/my", authMiddleware, getMyReports);

// All reports
router.get("/all", authMiddleware, getAllReports);

// NGO accepted reports
router.get("/accepted/list", authMiddleware, getAcceptedReports);
//radius
router.get("/getReportsByRadius",authMiddleware,getReportsByRadius);
//update report accepted by ngo
router.put("/updateaccepted/:id",authMiddleware,upload.array("media", 5),updateAcceptedReport);

// NGO accept report
router.put("/accept/:id", authMiddleware, acceptReport);
// Single report
router.get("/:id", authMiddleware, getReportById);
export default router;
