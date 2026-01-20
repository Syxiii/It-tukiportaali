import express from "express";
import { login, logout, register, getUsers, deleteUser} from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

router.post("/register", register);

router.get("/getusers", authenticate, getUsers);

router.post("/deleteuser", authenticate, deleteUser);

export default router;
