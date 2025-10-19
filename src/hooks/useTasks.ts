import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/taskService";
import type { Task } from "../types/task";

interface TaskListResponse {
    content: Task[];
    totalElements: number;
}

export const useTasks = (page = 0, size = 10, sort = "id,desc", completed?: boolean, search?: string) =>
    useQuery({
        queryKey: ["tasks", page, size, sort, completed, search],
        queryFn: () => fetchTasks(page, size, sort, completed, search),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });

// ➕ Optimistic create
export const useCreateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<Task>) => createTask(payload),
        onMutate: async (newTask) => {
            await qc.cancelQueries({ queryKey: ["tasks"] });
            const previous = qc.getQueryData<TaskListResponse | Task[]>(["tasks"]);

            qc.setQueryData(["tasks"], (old: TaskListResponse | Task[] | undefined) => {
                if (!old) return old;

                const optimistic: Task = {
                    id: Date.now(),
                    title: newTask.title ?? "",
                    description: newTask.description ?? "",
                    completed: newTask.completed ?? false,
                };

                if (Array.isArray(old)) return [optimistic, ...old];
                return {
                    ...old,
                    content: [optimistic, ...old.content],
                    totalElements: old.totalElements + 1,
                };
            });

            return { previous };
        },
        onError: (_err, _newTask, context) => {
            if (context?.previous) qc.setQueryData(["tasks"], context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    });
};

// ✏️ Optimistic update
export const useUpdateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<Task> }) => updateTask(id, payload),
        onMutate: async ({ id, payload }) => {
            await qc.cancelQueries({ queryKey: ["tasks"] });
            const previous = qc.getQueryData<TaskListResponse | Task[]>(["tasks"]);

            qc.setQueryData(["tasks"], (old: TaskListResponse | Task[] | undefined) => {
                if (!old) return old;
                const mutateItem = (item: Task) => (item.id === id ? { ...item, ...payload } : item);
                if (Array.isArray(old)) return old.map(mutateItem);
                return { ...old, content: old.content.map(mutateItem) };
            });

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) qc.setQueryData(["tasks"], context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    });
};

// ❌ Optimistic delete
export const useDeleteTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteTask(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ["tasks"] });
            const previous = qc.getQueryData<TaskListResponse | Task[]>(["tasks"]);

            qc.setQueryData(["tasks"], (old: TaskListResponse | Task[] | undefined) => {
                if (!old) return old;
                if (Array.isArray(old)) return old.filter((t) => t.id !== id);
                return {
                    ...old,
                    content: old.content.filter((t) => t.id !== id),
                    totalElements: old.totalElements - 1,
                };
            });

            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) qc.setQueryData(["tasks"], context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    });
};
