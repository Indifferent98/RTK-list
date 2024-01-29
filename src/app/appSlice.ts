import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: { status: "idle" as RequestStatus, error: null as string | null, isInitialized: false },
  reducers: {
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatus }>) {
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
