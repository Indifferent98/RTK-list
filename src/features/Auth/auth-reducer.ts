import { Dispatch } from "redux";
import { setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";
import { authAPI, LoginParamsType, ResponseResultCode } from "api/todolists-api";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksData } from "features/TodolistsList/tasks-reducer";
import { clearTodosData } from "features/TodolistsList/todolists-reducer";
import { handleServerAppError, handleServerNetworkError } from "common/utils";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const { setIsLoggedIn } = slice.actions;

// thunks
export const loginTC =
  (data: LoginParamsType) => (dispatch: Dispatch<ActionsType | setAppStatusActionType | setAppErrorActionType>) => {
    dispatch(setAppStatus({ status: "loading" }));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === ResponseResultCode.success) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .then(() => {
      dispatch(clearTasksData());
      dispatch(clearTodosData());
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types

type ActionsType = ReturnType<typeof setIsLoggedIn>;
