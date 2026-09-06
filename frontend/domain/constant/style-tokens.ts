import { SizeEnum } from "../enum/SizeEnum";
import { AccentColorEnum } from "../enum/AccentColorEnum";
import { ButtonVariantEnum } from "../enum/ButtonVariantEnum";
import { CardVariantEnum } from "../enum/CardVariantEnum";
import { UserStatusEnum } from "../enum/UserStatusEnum";

import type { THashMap } from "../type/TCommon";

export type TAccentTone = "primary" | "secondary" | "success" | "warning" | "danger" | "accent" | "muted";

export const toneClasses: Record<TAccentTone, string> = {
  primary: "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0",
  secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary border-0",
  success: "bg-success/10 text-success hover:bg-success/20 hover:text-success border-0",
  warning: "bg-warning/10 text-warning hover:bg-warning/20 hover:text-warning border-0",
  danger: "bg-danger/10 text-danger hover:bg-danger/20 hover:text-danger border-0",
  accent: "bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent border-0",
  muted: "bg-surface text-text-muted hover:bg-surface-hover hover:text-text border-0",
};

export const accentBg: Record<AccentColorEnum, string> = {
  [AccentColorEnum.Primary]: "bg-primary-muted",
  [AccentColorEnum.Secondary]: "bg-secondary-muted",
  [AccentColorEnum.Muted]: "bg-surface",
  [AccentColorEnum.Success]: "bg-success-muted",
  [AccentColorEnum.Warning]: "bg-warning-muted",
  [AccentColorEnum.Danger]: "bg-danger-muted",
  [AccentColorEnum.OnPrimary]: "bg-surface",
  [AccentColorEnum.Accent]: "bg-accent-muted",
  [AccentColorEnum.Inherit]: "bg-surface",
};

export const accentTile: Record<TAccentTone, string> = {
  primary: "bg-primary-muted text-primary",
  secondary: "bg-secondary-muted text-secondary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  accent: "bg-accent-muted text-accent",
  muted: "bg-surface text-text-muted",
};

export const statusColor: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-accent",
  [UserStatusEnum.Offline]: "bg-text-muted",
  [UserStatusEnum.All]: "bg-text-muted",
};

export const statusColorText: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Online]: AccentColorEnum.Success,
  [UserStatusEnum.InGame]: AccentColorEnum.Accent,
  [UserStatusEnum.Offline]: AccentColorEnum.Muted,
  [UserStatusEnum.All]: AccentColorEnum.Muted,
};

export const iconSize: THashMap<string> = {
  [SizeEnum.None]: "size-0",
  [SizeEnum.xs]: "size-3.5",
  [SizeEnum.sm]: "size-4",
  [SizeEnum.md]: "size-5",
  [SizeEnum.lg]: "size-6",
  [SizeEnum.xl]: "size-8",
  [SizeEnum.icon]: "size-11",
};

export const squareSize: THashMap<string> = {
  [SizeEnum.xs]: "size-8",
  [SizeEnum.sm]: "size-12",
  [SizeEnum.md]: "size-16",
  [SizeEnum.lg]: "size-20",
  [SizeEnum.xl]: "size-28",
};

export const spinnerSize: THashMap<string> = {
  [SizeEnum.sm]: "size-4",
  [SizeEnum.md]: "size-5",
  [SizeEnum.lg]: "size-8",
};

export const controlSize: THashMap<string> = {
  [SizeEnum.xs]: "h-7 px-2.5 text-xs gap-1",
  [SizeEnum.sm]: "h-9 px-3 text-sm gap-1.5",
  [SizeEnum.md]: "h-11 px-4 text-sm gap-2",
  [SizeEnum.lg]: "h-14 px-5 text-base gap-2.5",
  [SizeEnum.xl]: "h-16 px-6 text-lg gap-3",
  [SizeEnum.icon]: "size-11 p-0",
  [SizeEnum.iconSm]: "size-8 p-0",
};

export const fieldSize: THashMap<string> = {
  [SizeEnum.sm]: "px-3 py-2 text-sm",
  [SizeEnum.md]: "px-4 py-2.5 text-sm",
  [SizeEnum.xl]: "px-4 py-3.5 text-base",
};

export const tilePadding: THashMap<string> = {
  [SizeEnum.xs]: "p-1",
  [SizeEnum.sm]: "p-1.5",
  [SizeEnum.md]: "p-2",
  [SizeEnum.lg]: "p-2.5",
  [SizeEnum.xl]: "p-3",
};

export const radiusSize: THashMap<string> = {
  [SizeEnum.None]: "rounded-none",
  [SizeEnum.sm]: "rounded-md",
  [SizeEnum.md]: "rounded-lg",
  [SizeEnum.lg]: "rounded-xl",
  [SizeEnum.xl]: "rounded-2xl",
  [SizeEnum.full]: "rounded-full",
};

export const modalSize: THashMap<string> = {
  [SizeEnum.sm]: "max-w-xs",
  [SizeEnum.md]: "max-w-sm",
  [SizeEnum.lg]: "max-w-md",
  [SizeEnum.xl]: "max-w-lg",
};

export const pageSize: THashMap<string> = {
  [SizeEnum.None]: "max-w-3xl",
  [SizeEnum.xs]: "max-w-xl",
  [SizeEnum.sm]: "max-w-2xl",
  [SizeEnum.md]: "max-w-3xl",
  [SizeEnum.lg]: "max-w-6xl",
  [SizeEnum.xl]: "max-w-7xl",
  [SizeEnum.icon]: "max-w-3xl",
  [SizeEnum.full]: "max-w-full",
};

export const fieldBase =
  "w-full bg-surface border border-border rounded-lg text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary-muted hover:border-text-muted/50";

export const fieldError = "border-danger focus:border-danger focus:ring-danger-muted";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export const buttonVariantStyles: Record<ButtonVariantEnum, string> = {
  [ButtonVariantEnum.Primary]: "bg-primary text-on-primary shadow-sm hover:bg-primary-hover hover:text-on-primary",
  [ButtonVariantEnum.Secondary]: "bg-surface text-text border border-border/40 hover:bg-surface-hover hover:border-border/60",
  [ButtonVariantEnum.Subtle]: "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text",
  [ButtonVariantEnum.Danger]: "bg-danger text-on-primary shadow-sm hover:bg-danger/90 hover:text-on-primary",
};

export const cardVariantStyles: Record<CardVariantEnum, string> = {
  [CardVariantEnum.Default]: "bg-bg-card border border-border/40 shadow-sm",
  [CardVariantEnum.Outlined]: "bg-transparent border border-border/25",
  [CardVariantEnum.Elevated]: "bg-bg-elevated border border-border/40 shadow-md",
  [CardVariantEnum.Interactive]: "bg-bg-card border border-border/40 cursor-pointer transition-colors duration-150 hover:bg-bg-card-hover hover:shadow-md",
};
