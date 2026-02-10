import prisma from "../prisma/client.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
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

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Väärät tunnistetiedot" });
    }

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      return res.status(401).json({ message: "Väärät tunnistetiedot" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );


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


//POST /api/auth/register

export async function register(req, res) {
  try {
    const { name, email, password } = req.body; 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nimi, email ja salasana vaaditaan" });
    }   
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Käyttäjä on jo olemassa" });
    } 
    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: { name, email, passwordHash, role: "USER" }
    }); 
    return res.status(201).json({ 
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Palvelinvirhe" });
  }
}

export async function getUsers(req, res) {
    try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }});

    res.status(200).json(users);

  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}
/**
 * PUT /auth/toggleadmin/:id
 * Toggles the admin status of a user (ADMIN only)
 */
export async function toggle(req, res) {
  try {
    const userId = parseInt(req.body.userId);

    if (req.user.id === userId) {
      return res.status(400).json({ message: "Et voi muuttaa omaa admin-oikeuttasi" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Käyttäjää ei löydy" });
    }

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error("Toggle admin error:", err);
    res.status(500).json({ message: "Admin-oikeuksien muuttaminen epäonnistui" });
  }
}


export async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id);

    if (!userId) {
      return res.status(400).json({ message: "Virheellinen käyttäjä ID" });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: "Käyttäjä poistettu" });
  } catch (err) {
    console.error("Error deleting user:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
    }

    res.status(500).json({ message: "Palvelinvirhe" });
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

//Dd