import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import type { TPromise } from "@/domain/type/TCommon";

interface IEmailVerificationRepository {
  sendOtp(data: ISendOtpRequest): TPromise<void>;
  verifyOtp(data: IVerifyOtpRequest): TPromise<void>;
}

export type { IEmailVerificationRepository };
