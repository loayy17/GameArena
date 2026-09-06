"use client";

import { Circle, CircleCheck } from "lucide-react";

import { LocaleEnum } from "@/domain/enum/LocaleEnum";

import { GMenuItem } from "./GMenuItem";
import { GIcon } from "./GIcon";

import type { IGLocalePickerItemsProps } from "./def/GLocalePickerItems";

function GLocalePickerItems({ locale, labels, onSelect }: IGLocalePickerItemsProps) {
  const renderItem = (value: LocaleEnum) => (
    <GMenuItem key={value} label={labels[value]} disabled={locale === value} onClick={() => onSelect(value)}>
      <GIcon icon={locale === value ? CircleCheck : Circle} />
    </GMenuItem>
  );

  return (
    <>
      {renderItem(LocaleEnum.En)}
      {renderItem(LocaleEnum.Ar)}
      {renderItem(LocaleEnum.Fr)}
    </>
  );
}

export { GLocalePickerItems };
