import { todolistsThunks } from "../todolists/todolistsSlice";
import {
  ArgUpdateTask,
  TaskType,
  todolistsAPI,
  TodolistType,
  UpdateTaskModel,
} from "features/TodolistsList/api/todolistsApi";
import { setAppStatus } from "app/appSlice";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError } from "common/utils";
import { ResponseResultCode } from "common/enum";
import { BaseResponse } from "common/types";

const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "/tasks/fetchTasks",
  async (todolistId: string, { rejectWithValue }) => {
    const res = await todolistsAPI.getTasks(todolistId);
    if (res.data.items) {
      return { tasks: res.data.items, todolistId };
    } else {
      return rejectWithValue(null);
    }
  },
);

const removeTaskTC = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>("/task/removeTask", async (arg, { rejectWithValue }) => {
  const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
  if (res.data.resultCode === ResponseResultCode.success) {
    return arg;
  } else {
    return rejectWithValue(res.data);
  }
});

const updateTaskTC = createAppAsyncThunk<ArgUpdateTask, ArgUpdateTask>("/task/updateTask", async (arg, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const state = getState();
  const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
  if (!task) {
    return rejectWithValue(null);
  }

  const apiModel: UpdateTaskModel = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...arg.model,
  };
  const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
  if (res.data.resultCode === ResponseResultCode.success) {
    return { model: arg.model, taskId: arg.taskId, todolistId: arg.todolistId };
  } else {
    return rejectWithValue(res.data);
  }
});

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  "/tasks/addTask",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
    if (res.data.resultCode === ResponseResultCode.success) {
      return { task: res.data.data.item };
    } else {
      return rejectWithValue(res.data);
    }
  },
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: {
    clearTasksData(state, action: PayloadAction) {
      return {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) {
          tasks.splice(index, 1);
        }
      })
      .addCase(todolistsThunks.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      });
  },
});

export type UpdateDomainTaskModel = Partial<UpdateTaskModel>;
export type TasksState = Record<string, TaskType[]>;

export const { clearTasksData } = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasksTC, addTaskTC, removeTaskTC, updateTaskTC };
