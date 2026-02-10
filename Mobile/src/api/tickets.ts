import { api } from "./client";

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my");
  return response.data;
};

export const createTicket = async (ticket: {
  title: string;
  description: string;
}) => {
  const response = await api.post("/tickets/createtickets", ticket);
  return response.data;
};
