import { todolistsAPI, TodolistType } from "features/TodolistsList/api/todolistsApi";
import { RequestStatusType, setAppStatus } from "app/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { ResponseResultCode } from "common/enum";

const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "/todolists/fetchTodolistsTC",
  async (undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTodolists();

      if (res.data) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolists: res.data };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const removeTodolistTC = createAppAsyncThunk<{ todolistId: string }, string>(
  "/todolists/removeTodolistTC",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: "loading" }));
        return { todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "/todolists/addTodolistTC",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.data.item) {
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const changeTodolistTitleTC = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>("todolists/changeTodolistTitleTC", async (arg, thunkAPI) => {
  const { todolistId, title } = arg;
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.updateTodolist(todolistId, title);
    if (res.data.resultCode === ResponseResultCode.success) {
      return { todolistId, title };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) {
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
          } as TodolistDomainType),
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
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsThunks = { fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC };
