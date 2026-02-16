import express from "express";
import {
  getAllUsers,
  toggleBlacklist,
  deleteUser,
  getNgoUsers,
  getCitizenUsers,
  getBlacklistedAccounts,
  unblacklistUser,
  getAdminDashboardStats,
} from "../../controller/admin/adminUserController.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { deleteFakeReport, updateAdminStatus } from "../../controller/reportController.js";

const aroute = express.Router();

aroute.get("/users", authMiddleware, adminMiddleware, getAllUsers);
aroute.get("/ngousers",authMiddleware,adminMiddleware,getNgoUsers);
aroute.get("/citizenusers",authMiddleware,adminMiddleware,getCitizenUsers);
aroute.patch("/blacklist/:id", authMiddleware, adminMiddleware, toggleBlacklist);
aroute.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
aroute.get("/getblacklist",authMiddleware,adminMiddleware,getBlacklistedAccounts);
aroute.patch("/unblacklist/:id",authMiddleware,adminMiddleware,unblacklistUser);
aroute.get("/dashboardstats",authMiddleware,adminMiddleware,getAdminDashboardStats);

aroute.put("/reports/:id/admin-status",authMiddleware,adminMiddleware, updateAdminStatus);//false report
aroute.delete("/delete-report/:id",authMiddleware,adminMiddleware,deleteFakeReport);//fake report deleted
export default aroute;
