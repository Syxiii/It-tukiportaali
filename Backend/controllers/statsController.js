import prisma from "../prisma/client.js";

export async function getDashboardStats(req, res) {
  const totalTickets = await prisma.ticket.count();
  const openTickets = await prisma.ticket.count({ where: { status: "AVOIN" } });
  const inProgressTickets = await prisma.ticket.count({ where: { status: "KASITTELYSSA" } });
  const resolvedTickets = await prisma.ticket.count({ where: { status: "RATKAISTU" } });

  res.json({
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets
  });
}
//s