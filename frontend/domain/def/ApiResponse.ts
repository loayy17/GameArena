import { TNullable } from "@/types";
import { IApiResponse } from "../meta/IApiResponse";
import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";

class ApiResponse<T> implements IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  message: string;
  errorCode: ErrorCodeEnum;

  constructor(
    success: boolean,
    data: TNullable<T>,
    message: string,
    errorCode: ErrorCodeEnum,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errorCode = errorCode;
  }
}

export { ApiResponse };
