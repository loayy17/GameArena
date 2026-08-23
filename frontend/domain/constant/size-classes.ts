import { SizeEnum } from "../enum/SizeEnum";
import type { THashMap } from "../type/TCommon";

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

export const paddingSize: THashMap<string> = {
  [SizeEnum.None]: "p-0",
  [SizeEnum.sm]: "p-3",
  [SizeEnum.md]: "p-4",
  [SizeEnum.lg]: "p-6",
  [SizeEnum.xl]: "p-8",
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
  "w-full bg-surface border border-border rounded-lg text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary-muted hover:border-border-light";
