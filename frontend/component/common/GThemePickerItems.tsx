"use client";

import { Circle, CircleCheck } from "lucide-react";

import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { themeIcon, themeOrder } from "@/domain/constant/themeIcons";

import { GMenuItem } from "./GMenuItem";
import { GIcon } from "./GIcon";

import type { IGThemePickerItemsProps } from "./def/GThemePickerItems";

function GThemePickerItems({
    theme,
    labels,
    onSelect,
}: IGThemePickerItemsProps) {
    const renderItem = (value: ThemeEnum) => (
        <GMenuItem
            key={value}
            icon={themeIcon[value]}
            label={labels[value]}
            selected={theme === value}
            onClick={() => onSelect(value)}
        >
            <GIcon icon={theme === value ? CircleCheck : Circle} />
        </GMenuItem>
    );

    return <>{themeOrder.map(renderItem)}</>;
}

export { GThemePickerItems };
