"use client";

import { seedSettings } from "@/hooks/useSetting";

import type { ReactNode } from "react";
import type { LocaleEnum } from "@/domain/enum/LocaleEnum";
import type { ThemeEnum } from "@/domain/enum/ThemeEnum";

function SettingProvider({
    locale,
    theme,
    children,
}: {
    locale: LocaleEnum;
    theme: ThemeEnum;
    children: ReactNode;
}) {
    seedSettings(locale, theme);

    return children;
}

export { SettingProvider };

