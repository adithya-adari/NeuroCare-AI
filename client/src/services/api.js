import axios from "axios";

const API = axios.create({
  baseURL: "https://neurocare-ai-backend.onrender.com/api",
});

export default API;