import { api } from "./client";

export const getTickets = async () => {
  const { data } = await api.get("/tickets");
  return data;
};
