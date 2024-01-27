import { todolistsAPI, TodolistType } from "common/api/todolists-api";
import { RequestStatusType, setAppStatus } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, thunkTryCatch } from "common/utils";
import { AppDispatch } from "app/store";
import { ResponseResultCode } from "common/enum";

const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "/todolists/fetchTodolistsTC",
  async (undefined, thunkAPI) => {
    const { dispatch } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTodolists();

      if (res.data) dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
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
        dispatch(changeTodolistEntityStatus({ todolistId, status: "loading" }));
        return { todolistId };
      } else {
        return rejectWithValue(null);
      }
    });
  },
);

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "/todolists/addTodolistTC",
  async (title, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    debugger;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.data.item) {
        return { todolist: res.data.data.item };
      } else {
        return rejectWithValue(null);
      }
    });
  },
);

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistTitle(state, action: PayloadAction<{ todolistId: string; title: string }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].title = action.payload.title;
      }
    },
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
      });
  },
});

export const todolistsReducer = slice.reducer;
export const { changeTodolistEntityStatus, changeTodolistFilter, changeTodolistTitle, clearTodosData } = slice.actions;

export const changeTodolistTitleTC = (todolistId: string, title: string) => {
  return (dispatch: AppDispatch) => {
    todolistsAPI.updateTodolist(todolistId, title).then((res) => {
      dispatch(changeTodolistTitle({ todolistId, title }));
    });
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistThunks = { fetchTodolistsTC, removeTodolistTC, addTodolistTC };
