import type { TNullable } from "@/types";
import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";

interface IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  message: string;
  errorCode: ErrorCodeEnum;
}
export type { IApiResponse };
