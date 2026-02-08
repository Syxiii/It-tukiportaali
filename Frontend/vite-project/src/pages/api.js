import axios from "axios";

// Determine baseURL depending on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.luckybunny.eu/api" // production API
    : "http://localhost:8080/api";    // development API

const api = axios.create({ baseURL });


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
