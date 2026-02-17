import prisma from "../prisma/client.js";
import admin from "firebase-admin";
import fs from "fs";

const isProduction = process.env.NODE_ENV === "production"; // or process.env.PRODUCTION === "true"

let serviceAccount;
if (isProduction) {
  serviceAccount = JSON.parse(fs.readFileSync("/app/firebase.key.json", "utf-8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized (production)");
  }
} else {
  console.log("Firebase not initialized (not production)");
}


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
      AVOIN: "AVOIN",
      "Käsittelyssä": "KASITTELYSSA",
      Kasittelyssa: "KASITTELYSSA",
      KASITTELYSSA: "KASITTELYSSA",
      Ratkaistu: "RATKAISTU",
      RATKAISTU: "RATKAISTU",
    };

    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(id) }, include: { user: true }, });
    if (!ticket) {
      return res.status(404).json({ message: "Tikettiä ei löytynyt" });
    }

    const newStatus = statusMap[status] || ticket.status;

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

      if (
      ticket.status !== "RATKAISTU" &&
      newStatus === "RATKAISTU" &&
      updatedTicket.user?.fcmToken
    ) {
      await sendPushNotification(updatedTicket.user.fcmToken);
    }

    res.status(200).json(updatedTicket);
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Palvelinvirhe" });
  }
}

async function sendPushNotification(fcmToken) {

    if (!isProduction) {
    console.log("[DEV] Would send push notification:", { fcmToken, title, body });
    return;
  }
  
  if (!fcmToken) return;

  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: "Tiketti ratkaistu",
      body: "Yksi tiketeistäsi on merkitty ratkaistuksi."
    }
  });
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

export async function saveFcmToken(req, res) {
  try {
    const userId = req.user.id; // oletetaan että auth middleware
    const { fcmToken } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken }
    });

    res.status(200).json({ message: "FCM token tallennettu" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Virhe tokenin tallennuksessa" });
  }
}
