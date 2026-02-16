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

import authMiddleware from "../../middleware/authmiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";

const aroute = express.Router();

aroute.get("/users", authMiddleware, adminMiddleware, getAllUsers);
aroute.get("/ngousers",authMiddleware,adminMiddleware,getNgoUsers);
aroute.get("/citizenusers",authMiddleware,adminMiddleware,getCitizenUsers);
aroute.patch("/blacklist/:id", authMiddleware, adminMiddleware, toggleBlacklist);
aroute.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
aroute.get("/getblacklist",authMiddleware,adminMiddleware,getBlacklistedAccounts);
aroute.patch("/unblacklist/:id",authMiddleware,adminMiddleware,unblacklistUser);
aroute.get("/dashboardstats",authMiddleware,adminMiddleware,getAdminDashboardStats);


export default aroute;
