import { todolistsThunks } from "./todolists-reducer";
import { ArgUpdateTaskType, TaskType, todolistsAPI, UpdateTaskModelType } from "common/api/todolists-api";
import { setAppStatus } from "app/app-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError, thunkTryCatch } from "common/utils";
import { ResponseResultCode } from "common/enum";
import { BaseResponseType } from "common/types";

const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "/tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    const { dispatch } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTasks(todolistId);
      if (res.data.items) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { tasks: res.data.items, todolistId };
      } else {
        handleServerAppError({ messages: [res.data.error] } as BaseResponseType, dispatch);
        return { tasks: [], todolistId: "" };
      }
    });
  },
);

const removeTaskTC = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>("/task/removeTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
    if (res.data.resultCode === ResponseResultCode.success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
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
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResponseResultCode.success) {
        return { model: arg.model, taskId: arg.taskId, todolistId: arg.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  "/tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
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
      .addCase(todolistsThunks.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      });
  },
});

export type UpdateDomainTaskModelType = Partial<UpdateTaskModelType>;
export type TasksStateType = Record<string, TaskType[]>;

export const { clearTasksData } = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasksTC, addTaskTC, removeTaskTC, updateTaskTC };
