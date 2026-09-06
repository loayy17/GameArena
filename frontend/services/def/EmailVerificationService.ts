import { emailApi } from "@/repositories/proxy/email.api";

import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import type { TPromise } from "@/domain/type/TCommon";

class EmailVerificationService {
  private api = emailApi.api;

  sendOtp(data: ISendOtpRequest): TPromise<void> {
    return this.api.send<void>(data);
  }

  verifyOtp(data: IVerifyOtpRequest): TPromise<void> {
    return this.api.verify<void>(data);
  }
}

export const emailVerificationService = new EmailVerificationService();