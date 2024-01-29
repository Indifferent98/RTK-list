import { tasksReducer } from "features/TodolistsList/model/tasks/tasksSlice";
import { todolistsReducer } from "features/TodolistsList/model/todolists/todolistsSlice";
import { appReducer } from "./appSlice";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "features/Auth/model/authSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

//@ts-ignore
window.store = store;
