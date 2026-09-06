import { PasswordValidationEnum } from "@/domain/enum/PasswordValidationEnum";

import type { GTextFieldTranslation } from "./en.i18n";

const fr: GTextFieldTranslation = {
  required: "Requis",
  password: "Mot de passe",
  confirmPassword: "Confirmer le mot de passe",
  email: "E-mail",
  dynamicFieldRequired: (field: string) => `${field} est requis`,
  invalidEmail: "Adresse e-mail invalide",
  invalidConfirmPassword: "Les mots de passe ne correspondent pas",
  invalidPassword: {
    [PasswordValidationEnum.MinLength]:
      "Le mot de passe doit contenir au moins 8 caractères",
    [PasswordValidationEnum.MaxLength]:
      "Le mot de passe ne doit pas dépasser 64 caractères",
    [PasswordValidationEnum.Uppercase]:
      "Le mot de passe doit contenir au moins une lettre majuscule",
    [PasswordValidationEnum.Lowercase]:
      "Le mot de passe doit contenir au moins une lettre minuscule",
    [PasswordValidationEnum.Number]:
      "Le mot de passe doit contenir au moins un chiffre",
    [PasswordValidationEnum.SpecialChar]:
      "Le mot de passe doit contenir au moins un caractère spécial",
    [PasswordValidationEnum.NoSpaces]: "Le mot de passe ne doit pas contenir d'espaces",
  },
  showPassword: "Afficher le mot de passe",
  hidePassword: "Masquer le mot de passe",
  passwordHint: "8+ caractères avec majuscules, minuscules, chiffre et symbole",
};

export { fr };