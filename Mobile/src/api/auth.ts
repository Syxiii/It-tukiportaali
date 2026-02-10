import { api } from "./client";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data; // { token, user }
};

export const logoutRequest = async () => {
  await api.post("/auth/logout");
};
