"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "./useSetting";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { fr } from "@/component/i18n/SideBar/fr.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";

export function useNavigation() {
  const pathname = usePathname();
  const t = useTranslation({ en, ar, fr }) as TSidebarTranslation;

  const activeId = sidebarNav.filter((n) => pathname.startsWith(`/${n.id}`)).sort((a, b) => b.id.length - a.id.length)[0]?.id ?? "home";

  return { activeId, t, sidebarNav };
}
