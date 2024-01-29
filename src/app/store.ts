import { tasksReducer } from "features/TodolistsList/tasksReducer";
import { todolistsReducer } from "features/TodolistsList/todolistsReducer";
import { appReducer } from "./app-reducer";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "features/Auth/authReducer";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

//@ts-ignore
window.store = store;
