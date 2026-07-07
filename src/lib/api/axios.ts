import axios from "axios";

// BASE URL API backend Sociality
const BASE_URL = "https://be-social-media-api-production.up.railway.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR: get token each request
// ============================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Browser (Client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ============================================================
// RESPONSE INTERCEPTOR: Handling Global Error such: Token Expired
// ============================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
