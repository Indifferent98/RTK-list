import { setAppError, setAppStatus } from "app/appSlice";
import { AppDispatch } from "app/store";

import { BaseResponseType } from "common/types";

/**
 * Обработка ошибок с сервера.
 *
 * @template D - тип данных.
 * @param {BaseResponseType<D>} data - данные с ответом сервера.
 * @param {AppDispatch} dispatch - функция для отправки действий (actions) в Redux store.
 * @return {void} - функция ничего не возвращает
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: AppDispatch) => {
  dispatch(setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  dispatch(setAppStatus({ status: "failed" }));
};
