import { todolistsAPI, TodolistType } from "common/api/todolists-api";

import { RequestStatusType, setAppStatus } from "app/app-reducer";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setTodolists, tasksThunks } from "./tasks-reducer";
import { createAppAsyncThunk, thunkTryCatch } from "common/utils";
import { AppDispatch } from "app/store";
import { useAppDispatch } from "common/hooks/useAppDispatch";

const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "/todolists/fetchTodolistsTC",
  async (undefined, thunkAPI) => {
    const { dispatch } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTodolists();
      // dispatch(setTodolists({ todolists: res.data }));
      if (res.data) dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
      //Подумать над fetchtasks в экстраредьюсере, но надо проавильно изменить стейт, без return
    });
  },
);

// export const fetchTodolistsTC = () => {
//   return (dispatch: AppDispatch) => {
//     dispatch(setAppStatus({ status: "loading" }));
//     todolistsAPI
//       .getTodolists()
//       .then((res) => {
//         dispatch(setTodolists({ todolists: res.data }));

//         dispatch(setAppStatus({ status: "succeeded" }));
//         return res.data;
//       })
//       .then((todolists) => {
//         todolists.forEach((t) => {
//           dispatch(tasksThunks.fetchTasksTC(t.id));
//         });
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, entityStatus: "idle", filter: "all" });
    },
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
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((t) =>
        state.push({
          ...t,
          filter: "all",
          entityStatus: "idle",
        } as TodolistDomainType),
      );
    });
  },
});

export const todolistsReducer = slice.reducer;
export const {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  addTodolist,
  removeTodolist,
  clearTodosData,
} = slice.actions;

// thunks

export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));

    dispatch(changeTodolistEntityStatus({ todolistId, status: "loading" }));

    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist({ todolistId }));

      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist({ todolist: res.data.data.item }));
      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
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

export const todolistThunks = { fetchTodolistsTC };
