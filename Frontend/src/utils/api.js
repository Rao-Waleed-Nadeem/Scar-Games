import axios from "axios";

const api = axios.create({
  withCredentials: true, // ✅ Important for sending cookies
  baseURL: "http://localhost:8000/api/v1", // Adjust as needed
});

// ✅ Request Interceptor: Add content-type
api.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Just log errors (no token logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Optional: redirect or handle unauthorized access
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
