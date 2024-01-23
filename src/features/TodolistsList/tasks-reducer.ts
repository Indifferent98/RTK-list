import {
  addTodolisttionType,
  removeTodolisttionType,
  setTodoliststionType,
  addTodolist,
  removeTodolist,
  setTodolists,
} from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppDispatch, AppRootStateType } from "app/store";
import { setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ResponseType } from "api/todolists-api";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";
import { AxiosError } from "axios";

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
      handleServerNetworkError(error as { message: string }, dispatch);
      return rejectWithValue(null);
    }
  },
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    },
    addTask(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTask(state, action: PayloadAction<{ model: UpdateDomainTaskModelType; todolistId: string; taskId: string }>) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    // setTasks(state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) {
    //   state[action.payload.todolistId] = action.payload.tasks;
    // },
    clearTasksData(state, action: PayloadAction) {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
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

// thunks

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
  todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
    dispatch(removeTask({ taskId, todolistId }));
  });
};
export const addTaskTC =
  (title: string, todolistId: string) =>
  (dispatch: Dispatch<ActionsType | setAppErrorActionType | setAppStatusActionType>) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTask({ task: res.data.data.item }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTask({ model: domainModel, taskId, todolistId }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types
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
type ActionsType =
  | ReturnType<typeof removeTask>
  | ReturnType<typeof addTask>
  | ReturnType<typeof updateTask>
  | addTodolisttionType
  | removeTodolisttionType
  | setTodoliststionType;

type ThunkDispatch = Dispatch<ActionsType | setAppStatusActionType | setAppErrorActionType>;

export const { removeTask, addTask, updateTask, clearTasksData } = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasksTC };
