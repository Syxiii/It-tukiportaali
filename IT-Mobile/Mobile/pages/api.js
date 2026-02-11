import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Määritä baseURL ympäristön mukaan
const baseURL = "https://api.luckybunny.eu/api"; // Käytä tuotanto-API:ta

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
