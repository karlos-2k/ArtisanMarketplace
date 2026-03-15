// src/api/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // 🔥 REQUIRED FOR COOKIES
});


export default api;
