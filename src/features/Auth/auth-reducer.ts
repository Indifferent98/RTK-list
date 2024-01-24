import { setAppInitialized, setAppStatus } from "app/app-reducer";

import { createSlice } from "@reduxjs/toolkit";
import { clearTasksData } from "features/TodolistsList/tasks-reducer";
import { clearTodosData } from "features/TodolistsList/todolists-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "common/api/auth-api";
import { ResponseResultCode } from "common/enum";

export const LoginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "/auth/Login",
  async (data, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(data);
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);
export const LogOutTC = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/LogOut",
  async (undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await authAPI.logout();

      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(clearTasksData());
        dispatch(clearTodosData());
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const initializeAppTC = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "app/initializeAppTC",
  async (undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await authAPI.me();
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(
          authThunks.LoginTC.fulfilled({ isLoggedIn: true }, "requriedID", {
            email: "",
            password: "",
            rememberMe: false,
            captcha: "",
          }),
        );
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        // handleServerAppError(res.data, dispatch);
        dispatch(setAppStatus({ status: "failed" }));
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(setAppInitialized({ isInitialized: true }));
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(LoginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(LogOutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeAppTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

export const authReducer = slice.reducer;
export const authThunks = { LoginTC, LogOutTC, initializeAppTC };
