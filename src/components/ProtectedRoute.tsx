import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
    children?: React.ReactNode; // 👈 cho phép optional
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [checking, setChecking] = useState(true);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!token) {
                setValid(false);
                setChecking(false);
                return;
            }

            try {
                // 👉 Kiểm tra token có còn hợp lệ không (nếu có API verify)
                // await axios.get("/auth/verify", { headers: { Authorization: `Bearer ${token}` } });

                setValid(true);
            } catch (err) {
                console.error("Token verification failed:", err);
                // 🔄 Nếu token hết hạn, thử refresh
                if (refreshToken) {
                    try {
                        const res = await axios.post("/auth/refresh", { refreshToken });
                        localStorage.setItem("token", res.data.token);
                        setValid(true);
                    } catch {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        setValid(false);
                    }
                } else {
                    setValid(false);
                }
            } finally {
                setChecking(false);
            }
        };

        checkToken().catch(console.error);
    }, []);

    if (checking) return <div>Đang xác thực...</div>;

    if (!valid) return <Navigate to="/login" replace />;

    // 👇 Nếu có children (cách cũ) → render children
    // Nếu không (dùng nested route) → render Outlet
    return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
