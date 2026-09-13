import { LocaleEnum } from "@/domain/enum/LocaleEnum";

type TDirection = "ltr" | "rtl";
function isRtlLocale(locale: LocaleEnum): boolean {
  return locale === LocaleEnum.Ar;
}

function localeDirection(locale: LocaleEnum): TDirection {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

export { localeDirection };
export type { TDirection };