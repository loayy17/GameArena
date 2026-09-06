import type { ReactNode } from "react";
import type { useAuth } from "@/app/providers/AuthProvider";
import type { TSettingsTranslation } from "@/app/(dashboard)/settings/i18n/en.i18n";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";

type TSettingsTabTranslation = TSettingsTranslation & GTextFieldTranslation;

type TSettingsUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

interface IPrefRowProps {
  icon: ReactNode;
  label: string;
  control: ReactNode;
}

interface IProfileTabProps {
  user: TSettingsUser;
  showMessage: (msg: string, severity?: "success" | "danger") => void;
  t: TSettingsTabTranslation;
}

interface IPasswordTabProps {
  showMessage: (msg: string, severity?: "success" | "danger") => void;
  t: TSettingsTabTranslation;
}

interface IPreferencesTabProps {
  user: TSettingsUser;
  showMessage: (msg: string, severity?: "success" | "danger") => void;
  t: TSettingsTabTranslation;
}

export type { TSettingsTabTranslation, TSettingsUser, IPrefRowProps, IProfileTabProps, IPasswordTabProps, IPreferencesTabProps };
