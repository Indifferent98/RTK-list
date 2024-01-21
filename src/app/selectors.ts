import React from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "./store";
import { RequestStatusType } from "./app-reducer";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectStatus = (state: AppRootStateType) => state.app.status;
export const selectError = (state: AppRootStateType) => state.app.error;
