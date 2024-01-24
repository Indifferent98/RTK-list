import { todolistsAPI, TodolistType } from "common/api/todolists-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";

import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "./tasks-reducer";
import { handleServerNetworkError } from "common/utils";

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
    setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      const todolistsForSet: TodolistDomainType[] = action.payload.todolists.map((t) => ({
        ...t,
        filter: "all",
        entityStatus: "idle",
      }));
      return todolistsForSet;
    },
    clearTodosData(state, action: PayloadAction) {
      return [];
    },
  },
});

export const todolistsReducer = slice.reducer;
export const {
  setTodolists,
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  addTodolist,
  removeTodolist,
  clearTodosData,
} = slice.actions;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolists({ todolists: res.data }));

        dispatch(setAppStatus({ status: "succeeded" }));
        return res.data;
      })
      .then((todolists) => {
        todolists.forEach((t) => {
          dispatch(tasksThunks.fetchTasksTC(t.id));
        });
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));

    dispatch(changeTodolistEntityStatus({ todolistId, status: "loading" }));

    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist({ todolistId }));

      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist({ todolist: res.data.data.item }));
      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (todolistId: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistId, title).then((res) => {
      dispatch(changeTodolistTitle({ todolistId, title }));
    });
  };
};

// types
export type addTodolisttionType = ReturnType<typeof addTodolist>;
export type removeTodolisttionType = ReturnType<typeof removeTodolist>;
export type setTodoliststionType = ReturnType<typeof setTodolists>;
type ActionsType =
  | removeTodolisttionType
  | addTodolisttionType
  | ReturnType<typeof changeTodolistTitle>
  | ReturnType<typeof changeTodolistFilter>
  | setTodoliststionType
  | ReturnType<typeof changeTodolistEntityStatus>;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
type ThunkDispatch = Dispatch<ActionsType | setAppStatusActionType | setAppErrorActionType>;
