import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { cookies } from "next/headers";

export async function getSettingFromCookie(): Promise<{
  locale: LocaleEnum;
  theme: ThemeEnum;
}> {
  const cookieStore = await cookies();

  const locale = cookieStore.get("locale")?.value;
  const theme = cookieStore.get("theme")?.value;

  return {
    locale: locale === LocaleEnum.Ar ? LocaleEnum.Ar : locale === LocaleEnum.Fr ? LocaleEnum.Fr : LocaleEnum.En,
    theme: theme === ThemeEnum.Dark ? ThemeEnum.Dark : ThemeEnum.Light,
  };
}
