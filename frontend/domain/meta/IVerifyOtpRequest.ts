import type { TNullable } from "@/types";

interface IVerifyOtpRequest {
  email: TNullable<string>;
  otp: TNullable<string>;
}
export type { IVerifyOtpRequest };
