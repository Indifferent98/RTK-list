import { PayloadAction, UnknownAction, createSlice } from "@reduxjs/toolkit";

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
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/pending"),
        (state, action) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
        },
      )
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.status = "succeeded";
        },
      );
  },
});

export const { setAppError, setAppStatus, setAppInitialized } = slice.actions;
export const appReducer = slice.reducer;

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export type initialStateType = ReturnType<typeof slice.getInitialState>;
