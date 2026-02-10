//fix
import express from "express";
import { login, logout, register, getUsers, deleteUser, toggle} from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

router.post("/register", register);

router.get("/getusers", authenticate, requireAdmin, getUsers);

router.delete("/deleteuser/:id", authenticate, requireAdmin, deleteUser);

router.put("/toggleadmin/:id", authenticate, requireAdmin, toggle)

export default router;
