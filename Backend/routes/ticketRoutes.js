import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllTickets,
  getMyTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from "../controllers/ticketController.js";
import { getTicketComment, createTicketComment } from "../controllers/commentController.js";

const router = express.Router();

// GET /api/tickets/gettickets - all tickets (maybe admin only)
router.get("/gettickets", authenticate, requireAdmin, getAllTickets);

// GET /api/tickets/my - logged-in user's tickets
router.get("/my", authenticate, getMyTickets);

// POST /api//tickets/createtickets - create new ticket
router.post("/createtickets", authenticate, createTicket);

// PUT /api/tickets/update:id - update ticket
router.put("/update/:id", authenticate, updateTicket);

// DELETE /api/tickets/delete:id - delete ticket
router.delete("/delete/:id", authenticate, deleteTicket);

//COMMENT ROUTES FOR TICKETS

// GET /api/tickets/:id/getcomment - get comment
router.get("/:id/getcomment", authenticate, getTicketComment);

// POST /api/tickets/:id/createcomment - get comment
router.post("/:id/createcomment", authenticate, createTicketComment);

export default router;
