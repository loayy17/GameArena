import { authProxy } from "../proxy/auth.api";
import type { IForgotPasswordRequest } from "@/domain/meta/IForgotPasswordRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IResetPasswordRequest } from "@/domain/meta/IResetPasswordRequest";
import type { ILoginRequest } from "@/domain/meta/ILoginRequest";
import type { IAuthRepository } from "../meta/IAuthRepository";
import type { TPromise } from "@/domain/type/TCommon";

class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository;

  private api = authProxy.api;
  login(data: ILoginRequest): TPromise<void> {
    return this.api.login(data);
  }

  register(data: IRegisterRequest): TPromise<void> {
    return this.api.register(data);
  }

  logout(): TPromise<void> {
    return this.api.logout();
  }

  forgotPassword(data: IForgotPasswordRequest): TPromise<void> {
    return this.api.forgotPassword(data);
  }

  resetPassword(data: IResetPasswordRequest): TPromise<void> {
    return this.api.resetPassword(data);
  }
  static getInstance() {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }
}

export const authRepository = AuthRepository.getInstance();
