import { Monitor, Moon, Sun } from "lucide-react";

import { ThemeEnum } from "@/domain/enum/ThemeEnum";

import type { LucideIcon } from "lucide-react";

const themeIcon: Record<ThemeEnum, LucideIcon> = {
    [ThemeEnum.Light]: Sun,
    [ThemeEnum.Dark]: Moon,
    [ThemeEnum.System]: Monitor,
};

const themeOrder: ThemeEnum[] = [
    ThemeEnum.Light,
    ThemeEnum.Dark,
    ThemeEnum.System,
];

export { themeIcon, themeOrder };

