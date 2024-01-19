import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, entityStatus: "idle", filter: "all" });
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string; title: string }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].title = action.payload.title;
      }
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) {
      const index = state.findIndex((t) => t.id === action.payload.todolistId);
      if (index > -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      const todolistsForSet: TodolistDomainType[] = action.payload.todolists.map((t) => ({
        ...t,
        filter: "all",
        entityStatus: "idle",
      }));
      return todolistsForSet;
    },
  },
});

export const todolistsReducer = slice.reducer;
export const {
  setTodolistsAC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  addTodolistAC,
  removeTodolistAC,
} = slice.actions;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC({ todolists: res.data }));

        dispatch(setAppStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));

    dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));

    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC({ todolistId }));

      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC({ todolist: res.data.data.item }));
      dispatch(setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (todolistId: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistId, title).then((res) => {
      dispatch(changeTodolistTitleAC({ todolistId, title }));
    });
  };
};

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
type ThunkDispatch = Dispatch<ActionsType | setAppStatusActionType | setAppErrorActionType>;
