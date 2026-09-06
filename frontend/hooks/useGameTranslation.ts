"use client";

import { en as gameEn } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { fr as gameFr } from "@/component/i18n/Game/fr.i18n";

import { useTranslation } from "./useSetting";

import type { GameTranslations } from "@/component/i18n/Game/en.i18n";

export function useGameTranslation() {
  return useTranslation<GameTranslations>({ en: gameEn, ar: gameAr, fr: gameFr });
}
