import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 🟢 Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 🔒 Protected routes (dùng Outlet) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tasks" element={<TaskPage />} />
                </Route>

                {/* 🚫 Catch-all: route không tồn tại → về login */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;