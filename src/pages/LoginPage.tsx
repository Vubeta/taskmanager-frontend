import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate("/dashboard");
        } catch {
            setError("Tên đăng nhập hoặc mật khẩu sai");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-80"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Đăng nhập</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    className="border p-2 mb-3 w-full rounded"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border p-2 mb-3 w-full rounded"
                    placeholder="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    type="submit"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}
