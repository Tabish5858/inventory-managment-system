import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication tokens
api.interceptors.request.use(
  (config) => {
    // You can add authentication token logic here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
