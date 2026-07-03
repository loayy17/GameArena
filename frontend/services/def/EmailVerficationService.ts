import { emailVerficationRepository } from "@/repositories/def/EmailVerficationRepository";
import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import type { TPromise } from "@/domain/type/TCommon";

import type { IEmailVerficationService } from "../meta/IEmailVerficationService";
import type { IEmailVerficationRepository } from "@/repositories/meta/IEmailVerficationRepository";

class EmailVerficationService implements IEmailVerficationService {
  constructor(private repo: IEmailVerficationRepository) {}

  sendOtp(data: ISendOtpRequest): TPromise<void> {
    return this.repo.sendOtp(data);
  }

  verifyOtp(data: IVerifyOtpRequest): TPromise<void> {
    return this.repo.verifyOtp(data);
  }
}

const emailVerficationService = new EmailVerficationService(
  emailVerficationRepository,
);

export { emailVerficationService };
