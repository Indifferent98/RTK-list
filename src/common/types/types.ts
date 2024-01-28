export type BaseResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};
