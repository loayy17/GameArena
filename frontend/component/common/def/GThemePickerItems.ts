import type { ThemeEnum } from "@/domain/enum/ThemeEnum";

interface IGThemePickerItemsProps {
  theme: ThemeEnum;
  labels: Record<ThemeEnum, string>;
  onSelect: (theme: ThemeEnum) => void;
}

export type { IGThemePickerItemsProps };