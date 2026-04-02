import axios from "axios";

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});

export default api;
