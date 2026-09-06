"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Database, Globe, RefreshCw, Server } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GSpinner } from "@/component/common/GSpinner";
import { GPublicPageShell } from "@/component/common/GPublicPageShell";
import { GPageHeader } from "@/component/common/GPageHeader";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { healthService } from "@/services/def/HealthService";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { THealthTranslation } from "./i18n/en.i18n";
import type { IServiceRowProps, IStatusPillProps } from "./def/HealthPage";
import type { IHealth } from "@/domain/meta/IHealth";

function formatUptime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function StatusPill({ ok, label }: IStatusPillProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        ok ? "bg-success-muted text-success" : "bg-danger-muted text-danger"
      }`}>
      <span className={`size-2 rounded-full ${ok ? "bg-success" : "bg-danger"}`} />
      {label}
    </span>
  );
}

function ServiceRow({ icon, label, detail, ok, onlineLabel, offlineLabel }: IServiceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-muted">
          <GIcon icon={icon} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-text">{label}</p>
          <p className="mt-0.5 truncate text-xs text-text-muted">{detail}</p>
        </div>
      </div>
      <StatusPill ok={ok} label={ok ? onlineLabel : offlineLabel} />
    </div>
  );
}

function HealthPage() {
  const t = useTranslation<THealthTranslation>({ en, ar, fr });
  const [health, setHealth] = useState<IHealth | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState<string>("");
  const [origin] = useState<string>(() => (typeof window !== "undefined" ? window.location.origin : "-"));

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await healthService.getHealth();
      setHealth(res.data);
      setError(false);
    } catch {
      setHealth(null);
      setError(true);
    } finally {
      setCheckedAt(new Date().toLocaleTimeString());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(check, 0);
    return () => clearTimeout(timer);
  }, [check]);

  const backendOk = !!health && health.status === "ok";
  const databaseOk = health?.database === "connected";

  return (
    <GPublicPageShell>
      <GPageHeader icon={Activity} title={t.title} subtitle={t.subtitle} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <GSpinner size={SizeEnum.lg} />
        </div>
      ) : (
        <div className="space-y-4">
          <GCard className="divide-y divide-border/60 overflow-hidden">
            <ServiceRow
              icon={Server}
              label={t.backend}
              detail={health ? health.service : "-"}
              ok={backendOk}
              onlineLabel={t.online}
              offlineLabel={t.offline}
            />
            <ServiceRow icon={Globe} label={t.frontend} detail={origin} ok={!error} onlineLabel={t.online} offlineLabel={t.offline} />
            <ServiceRow
              icon={Database}
              label={t.database}
              detail={databaseOk ? t.online : t.offline}
              ok={databaseOk}
              onlineLabel={t.online}
              offlineLabel={t.offline}
            />
          </GCard>

          <GCard className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-text-secondary">
                <p>
                  {t.uptime}: <span className="font-semibold text-text">{health ? formatUptime(health.uptimeSeconds) : "-"}</span>
                </p>
                <p className="mt-1">
                  {t.checkedAt}: <span className="font-semibold text-text">{checkedAt}</span>
                </p>
              </div>
              <GButton variant={ButtonVariantEnum.Secondary} onClick={check} startIcon={<GIcon icon={RefreshCw} size={SizeEnum.sm} />}>
                {t.refresh}
              </GButton>
            </div>
          </GCard>
        </div>
      )}
    </GPublicPageShell>
  );
}

export default HealthPage;
