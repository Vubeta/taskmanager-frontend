import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authService";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(form);
            navigate("/login");
        } catch {
            setError("Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
                {error && <p className="text-red-500 mb-3">{error}</p>}

                <input
                    className="border p-2 mb-3 w-full rounded"
                    name="username"
                    placeholder="Tên đăng nhập"
                    onChange={handleChange}
                />
                <input
                    className="border p-2 mb-3 w-full rounded"
                    name="email"
                    placeholder="Email"
                    type="email"
                    onChange={handleChange}
                />
                <input
                    className="border p-2 mb-4 w-full rounded"
                    name="password"
                    placeholder="Mật khẩu"
                    type="password"
                    onChange={handleChange}
                />

                <button
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    type="submit"
                >
                    Đăng ký
                </button>

                <p className="text-center mt-3 text-sm">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}
