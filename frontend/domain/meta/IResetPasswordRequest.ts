import type { TNullable } from "@/types";

interface IResetPasswordRequest {
  email: TNullable<string>;
  newPassword: TNullable<string>;
  otp: TNullable<string>;
}
export type { IResetPasswordRequest };
