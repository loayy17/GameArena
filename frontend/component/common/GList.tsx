"use client";

import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { focusRing } from "@/domain/constant/style-tokens";
import { ar } from "@/component/i18n/GList/ar.i18n";
import { fr } from "@/component/i18n/GList/fr.i18n";
import { en } from "@/component/i18n/GList/en.i18n";
import { useTranslation } from "@/hooks/useSetting";

import { GEmpty } from "./GEmpty";
import { GButton } from "./GButton";
import { GIcon } from "./GIcon";

import type { GListTranslation } from "@/component/i18n/GList/en.i18n";
import type { IGListProps } from "./def/GList";

function GList<T>({
  items,
  children,
  keyExtractor,
  emptyMessage,
  emptyDescription,
  emptyIcon,
  className,
  listClassName,
  pageSize,
  defaultPage = 0,
}: IGListProps<T>) {
  const [page, setPage] = useState(defaultPage);
  const t = useTranslation<GListTranslation>({ en, ar, fr });

  const pageCount = pageSize !== undefined ? Math.ceil(items.length / pageSize) : 1;
  const paginated = pageCount > 1;
  const currentPage = paginated ? Math.min(page, pageCount - 1) : 0;
  const startIndex = paginated ? currentPage * (pageSize as number) : 0;
  const visibleItems = paginated ? items.slice(startIndex, startIndex + (pageSize as number)) : items;

  if (items.length === 0) {
    return (
      <GEmpty
        icon={emptyIcon ?? <GIcon icon={List} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("grid grid-cols-[minmax(0,1fr)]", listClassName)}>
        {visibleItems.map((item, index) => (
          <div key={keyExtractor ? keyExtractor(item, index) : index} className="min-w-0">{children(item, index)}</div>
        ))}
      </div>
      {paginated && (
        <div className="mt-3 flex items-center justify-center gap-1 border-t border-border pt-3">
          <GButton
            icon={ChevronLeft}
            label={t.previousPage}
            size={SizeEnum.iconSm}
            tone="muted"
            flip
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          {Array.from({ length: pageCount }, (_, index) => (
            <GButton
              key={index}
              variant={ButtonVariantEnum.Subtle}
              size={SizeEnum.None}
              aria-current={currentPage === index ? "page" : undefined}
              aria-label={String(index + 1)}
              onClick={() => setPage(index)}
              className={cn(
                "size-8 rounded-md text-sm font-semibold",
                focusRing,
                currentPage === index ? "bg-primary text-on-primary" : "text-text-secondary hover:bg-surface hover:text-text",
              )}>
              {index + 1}
            </GButton>
          ))}
          <GButton
            icon={ChevronRight}
            label={t.nextPage}
            size={SizeEnum.iconSm}
            tone="muted"
            flip
            disabled={currentPage === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
        </div>
      )}
    </div>
  );
}

export { GList };
