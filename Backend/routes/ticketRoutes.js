//fix

import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllTickets,
  getMyTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from "../controllers/ticketController.js";
import { getTicketComment, createTicketComment, updateTicketComment, deleteTicketComment } from "../controllers/commentController.js";

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

// GET /api/tickets/:ticketId/getcomment - get comments for ticket
router.get("/:ticketId/getcomment", authenticate, getTicketComment);

// POST /api/tickets/:ticketId/createcomment - create comment
router.post("/:ticketId/createcomment", authenticate, createTicketComment);

// PUT /api/tickets/:ticketId/updatecomment/:commentid - update comment
router.put("/:ticketId/updatecomment/:commentid", authenticate, updateTicketComment);

// DELETE /api/tickets/:ticketId/deletecomment/:commentid - delete comment
router.delete("/:ticketId/deletecomment/:commentid", authenticate, deleteTicketComment);

export default router;
