import apiClient from "./apiClient";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", data);
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // để LoginPage biết là lỗi
    }
};

export const register = async (data: RegisterRequest) => {
    return apiClient.post("/auth/register", data);
};

export const logout = () => {
    localStorage.removeItem("token");
};
