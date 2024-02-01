import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootState } from "app/store";
import { handleServerNetworkError } from "./handleServerNetworkError";

//logic thunks wrapper

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootState, unknown, AppDispatch, null>,
  logic: () => Promise<T>,
) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    return await logic();
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
};
