import apiClient from "./apiClient";
import type { Task } from "../types/task";

export interface TaskListResponse {
    content: Task[];      // nếu backend trả Page
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
}

interface TaskQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    completed?: boolean;
    search?: string;
}

export const fetchTasks = async (
    page = 0,
    size = 10,
    sort = "id,desc",
    completed?: boolean,
    search?: string
): Promise<TaskListResponse | Task[]> => {
    // Nếu backend hỗ trợ Pageable:
    const params: TaskQueryParams = { page, size, sort };
    if (completed !== undefined) params.completed = completed;
    if (search) params.search = search;

    const res = await apiClient.get("/tasks", { params });
    return res.data;
};

export const createTask = async (payload: Partial<Task>) => {
    const res = await apiClient.post("/tasks", payload);
    return res.data;
};

export const updateTask = async (id: number, payload: Partial<Task>) => {
    const res = await apiClient.put(`/tasks/${id}`, payload);
    return res.data;
};

export const deleteTask = async (id: number) => {
    const res = await apiClient.delete(`/tasks/${id}`);
    return res.data;
};
