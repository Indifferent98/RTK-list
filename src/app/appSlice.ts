import { AnyAction, PayloadAction, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";

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
      .addMatcher(isRejected, (state, action: AnyAction) => {
        if (
          (action.type.includes("addTodolistTC") ||
            action.type.includes("addTask") ||
            action.type.includes("initializeAppTC")) &&
          action.payload
        ) {
          return { ...state, status: "failed" };
        }

        let errorMessage = "Some error occurred";

        if (action.payload) {
          errorMessage = action.payload.messages.length ? action.payload.messages[0] : "Some error occurred";
        } else if (action.error.name === "AxiosError") {
          errorMessage = action.error.response?.data?.message || action.error?.message || errorMessage;
        } else if (action.error instanceof Error) {
          errorMessage = action.error.message;
        } else {
          errorMessage = JSON.stringify(action.error);
        }
        return { ...state, error: errorMessage, status: "failed" };
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
