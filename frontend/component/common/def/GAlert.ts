import type { ReactNode } from "react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

type TAlertSeverity = Extract<
  AccentColorEnum,
  | typeof AccentColorEnum.Primary
  | typeof AccentColorEnum.Secondary
  | typeof AccentColorEnum.Muted
  | typeof AccentColorEnum.Success
  | typeof AccentColorEnum.Warning
  | typeof AccentColorEnum.Danger
  | typeof AccentColorEnum.Accent
>;

interface IGAlertProps {
  severity?: TAlertSeverity;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export type { IGAlertProps, TAlertSeverity };
