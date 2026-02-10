//fix
import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/statsController.js";

const router = express.Router();

// GET /api/stats/dashboard - admin only
router.get("/dashboard", authenticate, requireAdmin, getDashboardStats);

export default router;
