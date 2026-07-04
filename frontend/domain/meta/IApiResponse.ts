import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";
import type { TNullable } from "../type/TCommon";

interface IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  message: string;
  errorCode: ErrorCodeEnum;
}
export type { IApiResponse };
