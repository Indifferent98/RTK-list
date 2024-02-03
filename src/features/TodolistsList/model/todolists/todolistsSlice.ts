import { todolistsAPI, TodolistType } from "features/TodolistsList/api/todolistsApi";
import { RequestStatus, setAppStatus } from "app/appSlice";
import { createSlice, PayloadAction, UnknownAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { ResponseResultCode } from "common/enum";
import { BaseResponse } from "common/types";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppRootState, AppDispatch } from "app/store";

const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "/todolists/fetchTodolistsTC",
  async (undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const res = await todolistsAPI.getTodolists();
    if (res.data) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(res.data);
    }
  },
);

const removeTodolistTC = createAppAsyncThunk<{ todolistId: string }, string>(
  "/todolists/removeTodolistTC",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const res = await todolistsAPI.deleteTodolist(todolistId);
    // .finally(() => dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: "loading" })));
    if (res.data.resultCode === ResponseResultCode.success) {
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: "loading" }));
      return { todolistId };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(res.data);
    }
  },
);

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "/todolists/addTodolistTC",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.data.item) {
      return { todolist: res.data.data.item };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(res.data);
    }
  },
);

const changeTodolistTitleTC = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>("todolists/changeTodolistTitleTC", async (arg, thunkAPI) => {
  const { todolistId, title } = arg;
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await todolistsAPI.updateTodolist(todolistId, title);
  if (res.data.resultCode === ResponseResultCode.success) {
    return { todolistId, title };
  } else {
    // handleServerAppError(res.data, dispatch);
    return rejectWithValue(res.data);
  }
});

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomain[],
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ todolistId: string; filter: FilterValues }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string; status: RequestStatus }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
    clearTodosData(state, action: PayloadAction) {
      return [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((t) =>
          state.push({
            ...t,
            filter: "all",
            entityStatus: "idle",
          } as TodolistDomain),
        );
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((t) => t.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, entityStatus: "idle", filter: "all" });
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((t) => t.id === action.payload.todolistId);
        if (index > -1) {
          state[index].title = action.payload.title;
        }
      })
      .addMatcher(
        (action: UnknownAction) => action.type.includes("removeTodolistTC") && action.type.endsWith("Rejected"),
        (state, action: PayloadAction<{ todolistId: string; status: RequestStatus }>) => {
          debugger;
          return state.map((t) => (t.id === action.payload.todolistId ? { ...t, entityStatus: "idle" } : t));
        },
      );
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

export type FilterValues = "all" | "active" | "completed";
export type TodolistDomain = TodolistType & {
  filter: FilterValues;
  entityStatus: RequestStatus;
};

export const todolistsThunks = { fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC };
