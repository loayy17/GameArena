import type { IForgotPasswordRequest } from "@/domain/meta/IForgotPasswordRequest";
import type { ILoginRequest } from "@/domain/meta/ILoginRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IResetPasswordRequest } from "@/domain/meta/IResetPasswordRequest";
import type { TPromise } from "@/types";

interface IAuthRepository {
  login(data: ILoginRequest): TPromise<void>;
  register(data: IRegisterRequest): TPromise<void>;
  logout(): TPromise<void>;
  refreshToken(): TPromise<void>;
  forgotPassword(data: IForgotPasswordRequest): TPromise<void>;
  resetPassword(data: IResetPasswordRequest): TPromise<void>;
}

export type { IAuthRepository };
