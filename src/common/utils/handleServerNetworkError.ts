import { setAppError, setAppStatus } from "app/appSlice";
import { AppDispatch } from "app/store";
import { isAxiosError } from "axios";
import React from "react";

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
