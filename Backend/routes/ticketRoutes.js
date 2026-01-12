import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAllTickets,
  getMyTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from "../controllers/ticketController.js";

const router = express.Router();

// GET /api/tickets - all tickets (maybe admin only)
router.get("/", authenticate, getAllTickets);

// GET /api/tickets/my - logged-in user's tickets
router.get("/my", authenticate, getMyTickets);

// POST /api/tickets - create new ticket
router.post("/", authenticate, createTicket);

// PUT /api/tickets/:id - update ticket
router.put("/:id", authenticate, updateTicket);

// DELETE /api/tickets/:id - delete ticket
router.delete("/:id", authenticate, deleteTicket);

export default router;
