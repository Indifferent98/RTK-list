import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "common/api/auth-api";
import { ResponseResultCode } from "common/enum";
import { authThunks } from "features/Auth/auth-reducer";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: { status: "idle" as RequestStatusType, error: null as string | null, isInitialized: false },
  reducers: {
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const { setAppError, setAppStatus, setAppInitialized } = slice.actions;
export const appReducer = slice.reducer;

export type initialStateType = ReturnType<typeof slice.getInitialState>;

export type setAppErrorActionType = ReturnType<typeof setAppError>;
export type setAppStatusActionType = ReturnType<typeof setAppStatus>;
