import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";
import {
  ArgUpdateTaskType,
  ResponseResultCode,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "common/api/todolists-api";

import { setAppStatus } from "app/app-reducer";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ResponseType } from "common/api/todolists-api";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError, handleServerNetworkError } from "common/utils";

const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "/tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.getTasks(todolistId);
      if (res.data.items) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { tasks: res.data.items, todolistId };
      } else {
        handleServerAppError({ messages: [res.data.error] } as ResponseType, dispatch);
        return { tasks: [], todolistId: "" };
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const removeTaskTC = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>("/task/removeTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
    if (res.data.resultCode === ResponseResultCode.success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return { taskId: "", todolistId: "" };
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const updateTaskTC = createAppAsyncThunk<ArgUpdateTaskType, ArgUpdateTaskType>(
  "/task/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI;
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.model,
    };

    try {
      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResponseResultCode.success) {
        return { model: arg.model, taskId: arg.taskId, todolistId: arg.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return {} as ArgUpdateTaskType;
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  "/tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
      }
      return { task: {} as TaskType };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
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
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
});

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const { clearTasksData } = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasksTC, addTaskTC, removeTaskTC, updateTaskTC };

// type ActionsType = addTodolisttionType | removeTodolisttionType | setTodoliststionType;

// type ThunkDispatch = Dispatch<ActionsType | setAppStatusActionType | setAppErrorActionType>;
