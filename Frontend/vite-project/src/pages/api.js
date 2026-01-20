//Käyttäätä Axios-kirjastoa API-kutsuihin backendistä.

//\It-tukiportaali\Backend\routes käytä näitä routeja kutsuihin.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;
