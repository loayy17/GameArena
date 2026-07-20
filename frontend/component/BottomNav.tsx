"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import clsx from "clsx";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { en as EnSidebar, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { ar as ArSidebar } from "@/component/i18n/SideBar/ar.i18n";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslation({ en: EnSidebar, ar: ArSidebar }) as TSidebarTranslation;

  const isActive = (id: string) => {
    const href = `/${id}`;
    return pathname === href || (id !== "home" && pathname.startsWith(href));
  };

  return (
    <nav className="fixed inset-inline-0 bottom-0 flex items-center justify-around h-18 pb-[env(safe-area-inset-bottom)] bg-bg-sidebar border-t border-border backdrop-blur-xl z-fixed md:hidden" role="navigation" aria-label="Bottom navigation">
      {sidebarNav.map((item) => (
        <a
          key={item.id}
          href={`/${item.id}`}
          className={clsx(
            "flex flex-col items-center gap-0.5 p-2 text-text-muted bg-transparent border-none cursor-pointer transition-all min-w-18",
            isActive(item.id) && "text-primary translate-y-[-2px]",
          )}
          aria-current={isActive(item.id) ? "page" : undefined}>
          <GIcon icon={item.icon} size="md" className="w-6 h-6" />
          <span className="text-2xs font-semibold">{t[item.labelKey as keyof TSidebarTranslation]}</span>
        </a>
      ))}
    </nav>
  );
}
