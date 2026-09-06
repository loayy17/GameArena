import type { LocaleEnum } from "@/domain/enum/LocaleEnum";

interface IGLocalePickerItemsProps {
  locale: LocaleEnum;
  labels: Record<LocaleEnum, string>;
  onSelect: (locale: LocaleEnum) => void;
}

export type { IGLocalePickerItemsProps };
