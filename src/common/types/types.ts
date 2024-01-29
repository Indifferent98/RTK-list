export type BaseResponse<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};
