import { Dispatch } from "redux";
import { ResponseResultCode, authAPI } from "../api/todolists-api";
import { setIsLoggedIn } from "../features/Login/auth-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === ResponseResultCode.success) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }
    dispatch(setAppInitialized({ isInitialized: true }));
  });
};

export type initialStateType = ReturnType<typeof slice.getInitialState>;

export type setAppErrorActionType = ReturnType<typeof setAppError>;
export type setAppStatusActionType = ReturnType<typeof setAppStatus>;

type ActionsType = setAppErrorActionType | setAppStatusActionType | ReturnType<typeof setAppInitialized>;
