import express from "express";
import {
  sendVolunteerRequest,
  getNgoRequests,
  updateRequestStatus,
} from "../controller/volunteerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const routerv = express.Router();

// Citizen sends request
routerv.post("/send", authMiddleware, sendVolunteerRequest);

// NGO sees all requests
routerv.get("/ngo-requests", authMiddleware, getNgoRequests);

// NGO accepts/rejects
routerv.put("/update/:Id", authMiddleware, updateRequestStatus);

export default routerv;