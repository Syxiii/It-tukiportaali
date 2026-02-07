import axios from "axios";
import * as Storage from "../utils/storage";

export const api = axios.create({
  baseURL: "http://localhost:3000", // muuta tarvittaessa
});

api.interceptors.request.use(async (config) => {
  const token = await Storage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
