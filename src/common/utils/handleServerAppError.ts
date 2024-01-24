import { setAppError, setAppErrorActionType, setAppStatus, setAppStatusActionType } from "app/app-reducer";
import { ResponseType } from "common/api/todolists-api";
import { Dispatch } from "redux";

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
