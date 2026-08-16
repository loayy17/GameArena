"use client";

import { useTranslation } from "./useSetting";
import { en as gameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { fr as gameFr } from "@/component/i18n/Game/fr.i18n";

export function useGameTranslation() {
  return useTranslation({ en: gameEn, ar: gameAr, fr: gameFr }) as GameTranslations;
}
