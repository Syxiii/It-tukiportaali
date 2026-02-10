import prisma from "../prisma/client.js";

/**
 * GET /api/tickets
 * Get all tickets (admin or open access)
 */
export async function getAllTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { email: true, name: true } }
      }
    });
    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

/**
 * GET /api/tickets/my
 * Get logged-in user's tickets
 */
export async function getMyTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { user: { email: req.user.email } }
    });
    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching my tickets:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

/**
 * POST /api/tickets
 * Create a new ticket
 */
export async function createTicket(req, res) {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Otsikko ja kuvaus vaaditaan" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "KESKITASO",
        user: { connect: { email: req.user.email } }
      },
      include: { user: { select: { email: true, name: true } } }
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

/**
 * PUT /api/tickets/:id
 * Update a ticket
 */
export async function updateTicket(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

      const statusMap = {
      Avoin: "AVOIN",
      "Käsittelyssä": "KASITTELYSSA",
      Ratkaistu: "RATKAISTU"
    };

    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
    if (!ticket) {
      return res.status(404).json({ message: "Tikettiä ei löytynyt" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: {
        title: title || ticket.title,
        description: description || ticket.description,
        status: statusMap[status] || ticket.status,
        priority: priority || ticket.priority
      },
      include: {
        user: true 
    }
   });

    res.status(200).json(updatedTicket);
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

/**
 * DELETE /api/tickets/:id
 * Delete a ticket
 */
export async function deleteTicket(req, res) {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
    if (!ticket) {
      return res.status(404).json({ message: "Tikettiä ei löytynyt" });
    }

    await prisma.ticket.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Tiketti poistettu onnistuneesti" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

//Ddd
