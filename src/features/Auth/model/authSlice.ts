import { todolistsActions } from "../../TodolistsList/model/todolists/todolistsSlice";
import { setAppInitialized, setAppStatus } from "app/appSlice";
import { createSlice } from "@reduxjs/toolkit";
import { clearTasksData } from "features/TodolistsList/model/tasks/tasksSlice";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { authAPI, LoginParamsType } from "features/Auth/api/authApi";
import { ResponseResultCode } from "common/enum";

const LoginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("/auth/Login", async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.login(data);
    if (res.data.resultCode === ResponseResultCode.success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const LogOutTC = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/LogOut",
  async (_undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResponseResultCode.success) {
        dispatch(clearTasksData());
        dispatch(todolistsActions.clearTodosData());
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const initializeAppTC = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "app/initializeAppTC",
  async (_undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
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
        // dispatch(setAppStatus({ status: "failed" }));
        return rejectWithValue(null);
      }
    }).finally(() => {
      dispatch(setAppInitialized({ isInitialized: true }));
    });
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
