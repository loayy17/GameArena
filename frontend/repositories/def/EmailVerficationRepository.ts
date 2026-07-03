import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IEmailVerficationRepository } from "../meta/IEmailVerficationRepository";
import type { TPromise } from "@/domain/type/TCommon";

import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import { emailApi } from "../proxy/email.api";

class EmailVerficationRepository implements IEmailVerficationRepository {
  private static instance: EmailVerficationRepository;
  private api = emailApi.api;

  sendOtp(data: ISendOtpRequest): TPromise<void> {
    return this.api.send(data);
  }

  verifyOtp(data: IVerifyOtpRequest): TPromise<void> {
    return this.api.verify(data);
  }

  static getInstance() {
    if (!EmailVerficationRepository.instance) {
      EmailVerficationRepository.instance = new EmailVerficationRepository();
    }
    return EmailVerficationRepository.instance;
  }
}

export const emailVerficationRepository =
  EmailVerficationRepository.getInstance();
