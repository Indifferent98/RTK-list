import { PayloadAction, UnknownAction, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

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
        const dispatch = useDispatch();
        state.status = "failed";
        dispatch(
          setAppError({
            error: action.payload.data.messages.length ? action.payload.data.messages[0] : "Some error occurred",
          }),
        );
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
