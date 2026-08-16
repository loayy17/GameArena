"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import type { TNullable } from "@/domain/type/TCommon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "@/component/common/GCard";

import { ar } from "@/app/(dashboard)/notifications/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/notifications/i18n/fr.i18n";
import { en, type TNotificationsTranslation } from "@/app/(dashboard)/notifications/i18n/en.i18n";

function NotificationPopup() {
  const router = useRouter();
  const t = useTranslation({ en, ar, fr }) as TNotificationsTranslation;
  const { notifications } = useDashboardData();
  const [visible, setVisible] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);
  const lastIdRef = useRef<TNullable<string>>(null);

  const latest = notifications.length > 0 ? (notifications.find((n) => !dismissedIds.has(n.id)) ?? notifications[0]) : null;

  const visibleRef = useRef(false);

  useEffect(() => {
    if (!latest) {
      visibleRef.current = false;
      return;
    }

    if (latest.id === lastIdRef.current) return;
    lastIdRef.current = latest.id;

    visibleRef.current = true;
    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [latest]);

  if (!visible || !latest) return null;

  const handleClick = () => {
    setVisible(false);
    router.push("/notifications");
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set(prev).add(latest.id));
    setVisible(false);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-popover" role="status" aria-live="polite">
      <GCard
        variant={CardVariantEnum.Elevated}
        padding={SizeEnum.md}
        className="flex items-center gap-3 cursor-pointer max-w-full sm:max-w-md shadow-lg">
        <button type="button" onClick={handleClick} className="flex items-center gap-3 flex-1">
          <GIcon icon={Bell} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
          <div className="min-w-0 flex-1 text-start">
            <p className="text-sm font-semibold text-text truncate">{latest.title}</p>
            <p className="text-xs text-text-secondary truncate">{latest.body}</p>
          </div>
        </button>
        <GButton variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} onClick={handleDismiss} aria-label={t.actions.dismiss}>
          <GIcon icon={X} size={SizeEnum.sm} color={AccentColorEnum.Muted} />
        </GButton>
      </GCard>
    </div>
  );
}

export { NotificationPopup };
