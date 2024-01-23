import { setAppError, setAppErrorActionType, setAppStatus, setAppStatusActionType } from "../app/app-reducer";
import { ResponseType } from "../api/todolists-api";
import { Dispatch } from "redux";
import { AppDispatch } from "app/store";
import { isAxiosError } from "axios";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<setAppErrorActionType | setAppStatusActionType>,
) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Some error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (error: unknown, dispatch: AppDispatch) => {
  let errorMessage = "Some error occurred";
  if (isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = JSON.stringify(error);
  }

  dispatch(setAppError({ error: errorMessage }));
  dispatch(setAppStatus({ status: "failed" }));
};
