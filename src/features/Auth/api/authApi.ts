import { BaseResponse } from "common/types";
import { instance } from "../../../common/api/baseApi";
export type LoginParams = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export const authAPI = {
  login(data: LoginParams) {
    return instance.post<BaseResponse<{ userId?: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponse<{ userId?: number }>>("auth/login");
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me");
  },
};
