import prisma from "../prisma/client.js";
import { verifyPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/login
 * Handles user login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ja salasana vaaditaan" });
    }

    // 1️⃣ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Väärät tunnistetiedot" });
    }

    // 2️⃣ Verify password
    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      return res.status(401).json({ message: "Väärät tunnistetiedot" });
    }

    // 3️⃣ Generate JWT (replace fake token)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );

    // 4️⃣ Send response
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Palvelinvirhe" });
  }
}

/**
 * POST /api/auth/logout
 * Handles logout (optional for JWT)
 */
export async function logout(req, res) {
  // JWT is stateless → no DB action required
  return res.status(200).json({ message: "Kirjauduttu ulos onnistuneesti" });
}
