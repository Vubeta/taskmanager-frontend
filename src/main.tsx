import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import AppToaster from "./components/Toaster.tsx"; // ✅ thêm dòng này
import "./index.css";

// ✅ Khởi tạo QueryClient
const queryClient = new QueryClient();

// ✅ Lấy phần tử root
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Không tìm thấy phần tử #root trong index.html");
}

// ✅ Tạo React root và render
createRoot(rootElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <AppToaster /> {/* ✅ thêm dòng này */}
        </QueryClientProvider>
    </React.StrictMode>
);
