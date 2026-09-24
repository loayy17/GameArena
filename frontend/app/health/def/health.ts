import type { LucideIcon } from "lucide-react";

interface IStatusPillProps {
  ok: boolean;
  label: string;
}

interface IServiceRowProps {
  icon: LucideIcon;
  label: string;
  detail: string;
  ok: boolean;
  onlineLabel: string;
  offlineLabel: string;
}

export type { IStatusPillProps, IServiceRowProps };
