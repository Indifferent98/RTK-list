import { setAppError, setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";
import { BaseResponseType } from "common/types/types";

import { Dispatch } from "redux";

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch<setAppErrorActionType | setAppStatusActionType>,
) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Some error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};
