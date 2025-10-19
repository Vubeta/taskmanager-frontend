import Navbar from "../components/Navbar";

export default function DashboardPage() {
    return (
        <>
            <Navbar />
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Bảng điều khiển</h1>
                <p className="text-gray-700">
                    Bạn đã đăng nhập thành công và có thể mở rộng hệ thống tại đây 🚀
                </p>
            </div>
        </>
    );
}
