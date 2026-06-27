import { PasswordValidationEnum } from "@/types";

type TEmailValidationText = {
  email: string;
  invalidEmail: string;
  dynamicFieldRequired: (field: string) => string;
};

type TPasswordValidationText = {
  password: string;
  invalidPassword: Record<PasswordValidationEnum, string>;
  dynamicFieldRequired: (field: string) => string;
};

const emailValidator =
  (t: TEmailValidationText) =>
  (value: string): string | null => {
    if (!value.trim()) return t.dynamicFieldRequired(t.email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? null
      : t.invalidEmail;
  };

const passwordValidator =
  (t: TPasswordValidationText) =>
  (value: string): string | null => {
    if (!value.trim()) return t.dynamicFieldRequired(t.password);
    const rules: string[] = [];
    if (value.length < 8)
      rules.push(t.invalidPassword[PasswordValidationEnum.MinLength]);
    if (value.length > 20)
      rules.push(t.invalidPassword[PasswordValidationEnum.MaxLength]);

    if (!/[A-Z]/.test(value))
      rules.push(t.invalidPassword[PasswordValidationEnum.Uppercase]);

    if (!/[a-z]/.test(value))
      rules.push(t.invalidPassword[PasswordValidationEnum.Lowercase]);

    if (!/[0-9]/.test(value))
      rules.push(t.invalidPassword[PasswordValidationEnum.Number]);

    if (!/[!@#$%^&*]/.test(value))
      rules.push(t.invalidPassword[PasswordValidationEnum.SpecialChar]);

    if (/\s/.test(value))
      rules.push(t.invalidPassword[PasswordValidationEnum.NoSpaces]);
    return rules.length ? rules.join("\n") : null;
  };

export { emailValidator, passwordValidator };
