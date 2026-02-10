import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";

/**
 * Authentication middleware
 * - Checks Authorization header
 * - Attaches user to req.user
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization puuttuu" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token puuttuu" });
    }
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    } catch (err) {
      return res.status(401).json({ message: "Virheellinen token" });
    }
    // TEMP: attach a real user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: "Käyttäjää ei löydy" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Autentikointivirhe" });
  }
}

/**
 * Admin-only middleware
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Vain adminille" });
  }
  next();
}

//fix