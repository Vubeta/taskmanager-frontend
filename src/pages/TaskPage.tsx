import React, { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import type { Task } from "../types/task";
import type { TaskListResponse } from "../api/taskService";
import toast from "react-hot-toast";
import SkeletonTaskItem from "../components/SkeletonTaskItem";

export default function TaskPage() {
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [sort, setSort] = useState("id,desc");
    const [completedFilter, setCompletedFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const completed =
        completedFilter === "all" ? undefined : completedFilter === "done";

    const { data, isLoading, isError } = useTasks(page, size, sort, completed, search);
    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    // ✅ Thêm task mới
    const handleAdd = async (title: string) => {
        if (!title.trim()) return;
        try {
            await createMutation.mutateAsync({ title });
            toast.success("✅ Thêm công việc thành công!");
        } catch (err) {
            console.error(err);
            toast.error("❌ Thêm công việc thất bại!");
        }
    };

    // ✅ Đánh dấu hoàn thành / chưa hoàn thành
    const handleToggle = async (task: Task) => {
        try {
            await updateMutation.mutateAsync({
                id: task.id,
                payload: { completed: !task.completed },
            });
            toast.success("🔁 Cập nhật trạng thái thành công!");
        } catch (err) {
            console.error(err);
            toast.error("❌ Không thể cập nhật công việc!");
        }
    };

    // ✅ Xóa task
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa công việc này?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("🗑️ Xóa công việc thành công!");
        } catch (err) {
            console.error(err);
            toast.error("❌ Xóa công việc thất bại!");
        }
    };

    // 📦 Xử lý dữ liệu trả về
    let tasks: Task[] = [];
    let totalPages = 1;
    if (Array.isArray(data)) {
        tasks = data;
    } else if (data && (data as TaskListResponse).content) {
        const pageData = data as TaskListResponse;
        tasks = pageData.content;
        totalPages = pageData.totalPages ?? 1;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Task Manager</h2>

            {/* Bộ lọc & sắp xếp */}
            <div className="mb-4 flex gap-3">
                <input
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <select value={completedFilter} onChange={(e) => setCompletedFilter(e.target.value)} className="border p-2 rounded">
                    <option value="all">Tất cả</option>
                    <option value="todo">Chưa hoàn thành</option>
                    <option value="done">Đã hoàn thành</option>
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
                    <option value="id,desc">Mới nhất</option>
                    <option value="id,asc">Cũ nhất</option>
                    <option value="title,asc">A → Z</option>
                </select>
            </div>

            <AddTaskForm onAdd={handleAdd} loading={createMutation.isPending} />

            {/* Loading state */}
            {isLoading && (
                <ul className="mt-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonTaskItem key={i} />
                    ))}
                </ul>
            )}
            {/* Error state */}
            {isError && <p className="text-red-500">Lỗi khi tải dữ liệu</p>}

            {/* Danh sách công việc */}
            {!isLoading && !isError && (
                <ul className="mt-4 space-y-2">
                    {tasks.map((t) => (
                        <li key={t.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={t.completed}
                                    onChange={() => handleToggle(t)}
                                />
                                <div>
                                    <div className={t.completed ? "line-through text-gray-500" : "font-medium"}>
                                        {t.title}
                                    </div>
                                    {t.description && <div className="text-sm text-gray-500">{t.description}</div>}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(t.id)} className="text-sm text-red-600">
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Phân trang (nếu có backend hỗ trợ) */}
            {!Array.isArray(data) && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((p) => Math.max(0, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                />
            )}
        </div>
    );
}

function AddTaskForm({ onAdd, loading }: { onAdd: (title: string) => void; loading?: boolean }) {
    const [title, setTitle] = React.useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onAdd(title);
                setTitle("");
            }}
            className="flex gap-2"
        >
            <input className="flex-1 border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Thêm công việc..." />
            <button className="bg-blue-600 text-white px-4 rounded" type="submit" disabled={loading}>
                Thêm
            </button>
        </form>
    );
}

function Pagination({ page, totalPages, onPrev, onNext }: { page: number; totalPages: number; onPrev: () => void; onNext: () => void }) {
    return (
        <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={onPrev} disabled={page <= 0} className="px-3 py-1 border rounded">
                Prev
            </button>
            <span>Trang {page + 1} / {totalPages}</span>
            <button onClick={onNext} disabled={page >= totalPages - 1} className="px-3 py-1 border rounded">
                Next
            </button>
        </div>
    );
}
