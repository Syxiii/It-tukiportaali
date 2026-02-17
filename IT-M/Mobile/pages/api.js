import axios from "axios";

// Base URL for mobile, aligned with the web frontend.
const baseURL = "https://api.luckybunny.eu/api";

const api = axios.create({ baseURL });

let authToken = "";

export const setAuthToken = (token) => {
  authToken = token || "";
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
