import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api", // backend Spring Boot
    headers: { "Content-Type": "application/json" },
});

// 🔒 Thêm JWT token vào header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
