import { UpdateDomainTaskModel } from "features/TodolistsList/model/tasks/tasksSlice";
import { instance } from "common/api/baseApi";
import { TaskStatuses, TaskPriorities } from "common/enum";
import { BaseResponse } from "common/types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<Todolist[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title: title });
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponse>(`todo-lists/${id}`, { title: title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<BaseResponse<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title: taskTitile });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<BaseResponse<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type Todolist = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  todoListId: string;
} & Todolist;

export type UpdateTaskModel = Omit<TaskType, "id" | "addedDate" | "order" | "todoListId">;
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};

export type ArgUpdateTask = { model: UpdateDomainTaskModel; todolistId: string; taskId: string };
