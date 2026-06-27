import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import type { TPromise } from "@/types";

interface IEmailVerficationService {
  sendOtp(data: ISendOtpRequest): TPromise<void>;
  verifyOtp(data: IVerifyOtpRequest): TPromise<void>;
}

export type { IEmailVerficationService };
