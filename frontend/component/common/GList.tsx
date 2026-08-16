"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { useState } from "react";

import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GButton } from "./GButton";
import type { IGListPaginationProps, IGListProps } from "./def/GList";
import { ar } from "@/component/i18n/GList/ar.i18n";
import { fr } from "@/component/i18n/GList/fr.i18n";
import { en, type GListTranslation } from "@/component/i18n/GList/en.i18n";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useTranslation } from "@/hooks/useSetting";

function GList<T>({
  items,
  children,
  keyExtractor,
  emptyMessage = "",
  emptyDescription = "",
  emptyIcon,
  className,
  listClassName,
  pageSize,
  defaultPage = 0,
}: IGListProps<T> & IGListPaginationProps) {
  const [page, setPage] = useState(defaultPage);
  const t = useTranslation({ en, ar, fr }) as GListTranslation;
  const paginated = pageSize !== undefined && items.length > pageSize;
  const currentPage = paginated ? Math.min(page, Math.ceil(items.length / pageSize) - 1) : 0;
  const startIndex = paginated ? currentPage * pageSize : 0;
  const visibleItems = paginated ? items.slice(startIndex, startIndex + pageSize) : items;

  if (items.length === 0) {
    return (
      <GEmpty
        icon={emptyIcon ?? <GIcon icon={List} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={emptyMessage}
        description={emptyDescription ?? ""}
      />
    );
  }

  return (
    <div className={clsx("flex flex-col", className)}>
      <div className={clsx("grid", listClassName)}>
        {visibleItems.map((item, index) => (
          <div key={keyExtractor(item, index)}>{children(item, index)}</div>
        ))}
      </div>
      {paginated && (
        <div className="flex items-center justify-center gap-1 border-t border-border pt-3 mt-3">
          <GButton
            variant={ButtonVariantEnum.Subtle}
            size={SizeEnum.icon}
            disabled={currentPage === 0}
            aria-label={t.previousPage}
            title={t.previousPage}
            onClick={() => setPage((p) => Math.max(0, p - 1))}>
            <GIcon icon={ChevronLeft} size={SizeEnum.sm} color={AccentColorEnum.Secondary} />
          </GButton>

          {Array.from({ length: Math.ceil(items.length / pageSize) }, (_, index) => (
            <GButton
              key={index}
              variant={currentPage === index ? ButtonVariantEnum.Primary : ButtonVariantEnum.Subtle}
              disabled={currentPage === index}
              size={SizeEnum.icon}
              aria-current={currentPage === index ? "page" : undefined}
              onClick={() => setPage(index)}>
              {index + 1}
            </GButton>
          ))}

          <GButton
            variant={ButtonVariantEnum.Subtle}
            size={SizeEnum.icon}
            disabled={currentPage === Math.ceil(items.length / pageSize) - 1}
            aria-label={t.nextPage}
            title={t.nextPage}
            onClick={() => setPage((p) => Math.min(Math.ceil(items.length / pageSize) - 1, p + 1))}>
            <GIcon icon={ChevronRight} size={SizeEnum.sm} color={AccentColorEnum.Secondary} />
          </GButton>
        </div>
      )}
    </div>
  );
}

export { GList };
