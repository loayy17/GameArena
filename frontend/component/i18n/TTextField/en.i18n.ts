import { PasswordValidationEnum } from "@/types";

const en = {
  required: "Required",
  password: "Password",
  confirmPassword: "Confirm Password",
  email: "Email",
  dynamicFieldRequired: (field: string) => `${field} is required`,
  invalidEmail: "Invalid email address",
  invalidNumber: "Invalid number",
  invalidConfirmPassword: "Passwords do not match",
  invalidPassword: {
    [PasswordValidationEnum.MinLength]:
      "Password must be at least 8 characters long",
    [PasswordValidationEnum.MaxLength]:
      "Password must not exceed 20 characters",
    [PasswordValidationEnum.Uppercase]:
      "Password must contain at least one uppercase letter",
    [PasswordValidationEnum.Lowercase]:
      "Password must contain at least one lowercase letter",
    [PasswordValidationEnum.Number]:
      "Password must contain at least one number",
    [PasswordValidationEnum.SpecialChar]:
      "Password must contain at least one special character",
    [PasswordValidationEnum.NoSpaces]: "Password must not contain spaces",
  },
};

export default en;
export type TTextFieldTranslation = typeof en;
