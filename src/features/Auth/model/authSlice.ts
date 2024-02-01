import { todolistsActions } from "../../TodolistsList/model/todolists/todolistsSlice";
import { setAppInitialized, setAppStatus } from "app/appSlice";
import { PayloadAction, UnknownAction, createSlice, isFulfilled } from "@reduxjs/toolkit";
import { clearTasksData } from "features/TodolistsList/model/tasks/tasksSlice";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { authAPI, LoginParams } from "features/Auth/api/authApi";
import { ResponseResultCode } from "common/enum";

const LoginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>("auth/Login", async (data, thunkAPI) => {
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
  "auth/initializeAppTC",
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
        return { isLoggedIn: true };
      } else {
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
    builder.addMatcher(
      (action: UnknownAction) => action.type.startsWith("auth") && action.type.endsWith("fulfilled"),
      (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      },
    );
  },
});

export const authReducer = slice.reducer;
export const authThunks = { LoginTC, LogOutTC, initializeAppTC };
