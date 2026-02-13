import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for mobile, aligned with the web frontend.
const baseURL = "https://api.luckybunny.eu/api";

const api = axios.create({ baseURL });

// Lisää token pyynnön headeriin
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Virhe tokenin lukemisessa:", error);
    return config;
  }
});

export default api;
