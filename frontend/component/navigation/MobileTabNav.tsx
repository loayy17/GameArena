"use client";

import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { focusRing, sectionLabel } from "@/domain/constant/style-tokens";
import { useNavItems } from "@/hooks/useNavItems";
import { GNav } from "@/component/common/GNav";
import { GModal } from "@/component/common/GModal";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { IGNavItem } from "@/component/common/def/GNav";

const PRIMARY_IDS = ["home", "games", "messages", "friends"];

function MobileTabNav() {
  const { t, navItems, sections } = useNavItems();
  const [moreOpen, setMoreOpen] = useState(false);

  const itemsById = new Map(navItems.map((item) => [item.id, item]));
  const primaryIds = new Set(PRIMARY_IDS);
  const primaryItems = PRIMARY_IDS.map((id) => itemsById.get(id)).filter(Boolean) as IGNavItem[];
  const moreSections = sections
    .map((section) => ({ ...section, items: section.items.filter((item) => !primaryIds.has(item.id)) }))
    .filter((section) => section.items.length > 0);
  const moreActive = navItems.some((item) => item.active && !primaryIds.has(item.id));

  const closeMore = () => setMoreOpen(false);
  const withClose = (items: IGNavItem[]) => items.map((item) => ({ ...item, onClick: closeMore }));

  return (
    <>
      <nav
        aria-label={t.mainNavigation}
        className="fixed inset-x-2 bottom-2 z-sticky rounded-2xl border border-border/60 bg-bg-sidebar/95 p-1.5 shadow-lg backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 items-stretch">
          <GNav
            items={primaryItems}
            orientation={NavOrientationEnum.Horizontal}
            stacked
            className="col-span-4"
            aria-label={t.mainNavigation}
          />
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-2xs font-medium",
              focusRing,
              moreActive ? "text-primary font-semibold" : "text-text-secondary hover:bg-surface-hover hover:text-text",
            )}>
            <GIcon icon={MoreHorizontal} size={SizeEnum.md} />
            {t.more}
          </button>
        </div>
      </nav>

      <GModal open={moreOpen} onClose={closeMore} side="bottom" ariaLabel={t.more}>
        <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border" />
        <header className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
          <h2 className="text-base font-bold text-text">{t.more}</h2>
          <GButton icon={X} label={t.close} variant={ButtonVariantEnum.Subtle} size={SizeEnum.iconSm} onClick={closeMore} />
        </header>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {moreSections.map((section, index) => (
            <section key={section.id} aria-label={section.label} className={cn("py-2", index > 0 && "border-t border-border")}>
              <p className={cn("px-3 pb-1.5 pt-1", sectionLabel)}>{section.label}</p>
              <GNav items={withClose(section.items)} orientation={NavOrientationEnum.Vertical} />
            </section>
          ))}
        </div>
      </GModal>
    </>
  );
}

export { MobileTabNav };
