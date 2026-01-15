import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

router.post("/register", register);

export default router;
