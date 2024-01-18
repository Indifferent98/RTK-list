import { Dispatch } from "redux";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedIn } from "../features/Login/auth-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

const slice = createSlice({
  name: "app",
  initialState,
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
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }
    dispatch(setAppInitialized({ isInitialized: true }));
  });
};

export type setAppErrortionType = ReturnType<typeof setAppError>;
export type setAppStatustionType = ReturnType<typeof setAppStatus>;

type ActionsType = setAppErrortionType | setAppStatustionType | ReturnType<typeof setAppInitialized>;
