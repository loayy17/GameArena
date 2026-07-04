import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IEmailVerificationRepository } from "../meta/IEmailVerificationRepository";
import type { TPromise } from "@/domain/type/TCommon";

import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import { emailApi } from "../proxy/email.api";

class EmailVerificationRepository implements IEmailVerificationRepository {
  private static instance: EmailVerificationRepository;
  private api = emailApi.api;

  sendOtp(data: ISendOtpRequest): TPromise<void> {
    return this.api.send(data);
  }

  verifyOtp(data: IVerifyOtpRequest): TPromise<void> {
    return this.api.verify(data);
  }

  static getInstance() {
    if (!EmailVerificationRepository.instance) {
      EmailVerificationRepository.instance = new EmailVerificationRepository();
    }
    return EmailVerificationRepository.instance;
  }
}

export const emailVerificationRepository =
  EmailVerificationRepository.getInstance();
