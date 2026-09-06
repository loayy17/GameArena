import { PasswordValidationEnum } from "@/domain/enum/PasswordValidationEnum";

import type { GTextFieldTranslation } from "./en.i18n";

const ar: GTextFieldTranslation = {
  required: "مطلوب",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  email: "البريد الإلكتروني",
  dynamicFieldRequired: (field: string) => `حقل ${field} مطلوب`,
  invalidEmail: "عنوان البريد الإلكتروني غير صالح",
  invalidConfirmPassword: "كلمات المرور غير متطابقة",
  invalidPassword: {
    [PasswordValidationEnum.MinLength]:
      "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    [PasswordValidationEnum.MaxLength]: "يجب ألا تتجاوز كلمة المرور 64 حرفًا",
    [PasswordValidationEnum.Uppercase]:
      "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل",
    [PasswordValidationEnum.Lowercase]:
      "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل",
    [PasswordValidationEnum.Number]:
      "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
    [PasswordValidationEnum.SpecialChar]:
      "يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل",
    [PasswordValidationEnum.NoSpaces]: "يجب ألا تحتوي كلمة المرور على مسافات",
  },
  showPassword: "إظهار كلمة المرور",
  hidePassword: "إخفاء كلمة المرور",
  passwordHint: "٨ أحرف فأكثر وتشمل أحرفًا كبيرة وصغيرة ورقمًا ورمزًا خاصًا",
};

export { ar };
