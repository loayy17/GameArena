"use client";

import { Circle, CircleCheck, Moon, Sun } from "lucide-react";

import { ThemeEnum } from "@/domain/enum/ThemeEnum";

import { GMenuItem } from "./GMenuItem";
import { GIcon } from "./GIcon";

import type { LucideIcon } from "lucide-react";
import type { IGThemePickerItemsProps } from "./def/GThemePickerItems";

const themeIcons: Record<ThemeEnum, LucideIcon> = {
  [ThemeEnum.Light]: Sun,
  [ThemeEnum.Dark]: Moon,
};

function GThemePickerItems({ theme, labels, onSelect }: IGThemePickerItemsProps) {
  const renderItem = (value: ThemeEnum) => (
    <GMenuItem key={value} icon={themeIcons[value]} label={labels[value]} selected={theme === value} onClick={() => onSelect(value)}>
      <GIcon icon={theme === value ? CircleCheck : Circle} />
    </GMenuItem>
  );

  return (
    <>
      {renderItem(ThemeEnum.Light)}
      {renderItem(ThemeEnum.Dark)}
    </>
  );
}

export { GThemePickerItems };