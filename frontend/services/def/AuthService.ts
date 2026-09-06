import { authProxy } from "@/repositories/proxy/auth.api";

import type { IForgotPasswordRequest } from "@/domain/meta/IForgotPasswordRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IResetPasswordRequest } from "@/domain/meta/IResetPasswordRequest";
import type { ILoginRequest } from "@/domain/meta/ILoginRequest";
import type { TPromise } from "@/domain/type/TCommon";

class AuthService {
  private api = authProxy.api;

  login(data: ILoginRequest): TPromise<void> {
    return this.api.login<void>(data);
  }

  register(data: IRegisterRequest): TPromise<void> {
    return this.api.register<void>(data);
  }

  logout(): TPromise<void> {
    return this.api.logout<void>();
  }

  forgotPassword(data: IForgotPasswordRequest): TPromise<void> {
    return this.api.forgotPassword<void>(data);
  }

  resetPassword(data: IResetPasswordRequest): TPromise<void> {
    return this.api.resetPassword<void>(data);
  }
}

export const authService = new AuthService();