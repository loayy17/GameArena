import { cookies } from "next/headers";

import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SETTING_COOKIE } from "@/domain/constant/settings";

export async function getSettingFromCookie(): Promise<{
    locale: LocaleEnum;
    theme: ThemeEnum;
}> {
    const cookieStore = await cookies();

    const locale = cookieStore.get(SETTING_COOKIE.locale)?.value;
    const theme = cookieStore.get(SETTING_COOKIE.theme)?.value;

    return {
        locale:
            locale === LocaleEnum.Ar
                ? LocaleEnum.Ar
                : locale === LocaleEnum.Fr
                  ? LocaleEnum.Fr
                  : LocaleEnum.En,
        theme:
            theme === ThemeEnum.Light
                ? ThemeEnum.Light
                : theme === ThemeEnum.System
                  ? ThemeEnum.System
                  : ThemeEnum.Dark,
    };
}
