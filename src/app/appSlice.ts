import { PayloadAction, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "common/utils";

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
      .addMatcher(isPending, (state, action) => {
        state.status = "loading";
      })
      .addMatcher(isRejected, (state, action: PayloadAction<any>) => {
        debugger;
        handleServerNetworkError(action.payload.error);
        if (action.type.includes("addTodolistTC") || action.type.includes("addTask")) {
          state.status = "failed";
          return;
        }
        return {
          ...state,
          status: "failed",
          error: action.payload.messages.length ? action.payload.messages[0] : "Some error occurred",
        };
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.status = "succeeded";
      });
  },
});

export const { setAppError, setAppStatus, setAppInitialized } = slice.actions;
export const appReducer = slice.reducer;

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export type initialStateType = ReturnType<typeof slice.getInitialState>;
