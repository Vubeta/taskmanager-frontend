import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authService";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
            <Link to="/dashboard" className="font-bold text-lg">
                TaskManager
            </Link>
            <div className="space-x-4">
                <Link to="/dashboard" className="hover:underline">
                    Dashboard
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                    Đăng xuất
                </button>
            </div>
        </nav>
    );
}
