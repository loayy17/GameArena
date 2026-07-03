import type { IForgotPasswordRequest } from "@/domain/meta/IForgotPasswordRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IResetPasswordRequest } from "@/domain/meta/IResetPasswordRequest";
import type { ILoginRequest } from "@/domain/meta/ILoginRequest";
import type { TPromise } from "@/domain/type/TCommon";

import type { IAuthService } from "../meta/IAuthService";
import { authRepository } from "@/repositories/def/AuthRepository";
import type { IAuthRepository } from "@/repositories/meta/IAuthRepository";

class AuthService implements IAuthService {
  constructor(private repo: IAuthRepository) {}
  login(data: ILoginRequest): TPromise<void> {
    return this.repo.login(data);
  }

  register(data: IRegisterRequest): TPromise<void> {
    return this.repo.register(data);
  }

  logout(): TPromise<void> {
    return this.repo.logout();
  }

  refreshToken(): TPromise<void> {
    return this.repo.refreshToken();
  }

  forgotPassword(data: IForgotPasswordRequest): TPromise<void> {
    return this.repo.forgotPassword(data);
  }

  resetPassword(data: IResetPasswordRequest): TPromise<void> {
    return this.repo.resetPassword(data);
  }
}

const authService = new AuthService(authRepository);

export { authService };
