import type { ErrorCodeEnum } from "../enum/ErrorCodeEnum";
import type { TNullable } from "../type/TCommon";

interface IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  errorCode: ErrorCodeEnum;
}
export type { IApiResponse };
