"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Database, Globe, RefreshCw, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GCard } from "@/component/common/GCard";
import { GSpinner } from "@/component/common/GSpinner";
import { GPage } from "@/component/common/GPage";
import { PageHeader } from "@/component/common/PageHeader";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { apiBase } from "@/app/network";
import { en, type THealthTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

type THealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  database: string;
};

async function fetchHealth(): Promise<THealthResponse> {
  const res = await fetch(`${apiBase}/health`, { cache: "no-store" });
  return (await res.json()) as THealthResponse;
}

function formatUptime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}>
      <span className={`size-2 rounded-full ${ok ? "bg-success" : "bg-danger"}`} />
      {label}
    </span>
  );
}

function ServiceRow({
  icon,
  label,
  detail,
  ok,
  onlineLabel,
  offlineLabel,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
  ok: boolean;
  onlineLabel: string;
  offlineLabel: string;
}) {
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
  const t = useTranslation({ en, ar, fr }) as THealthTranslation;
  const [health, setHealth] = useState<THealthResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState<string>("");

  const check = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchHealth();
      setHealth(data);
      setCheckedAt(new Date().toLocaleTimeString());
    } catch {
      setError(true);
      setHealth(null);
      setCheckedAt(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then((data) => {
        if (cancelled) return;
        setHealth(data);
        setCheckedAt(new Date().toLocaleTimeString());
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setHealth(null);
        setCheckedAt(new Date().toLocaleTimeString());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const backendOk = !!health && health.status === "ok";
  const databaseOk = health?.database === "connected";

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center justify-between gap-2 p-4 lg:p-8">
        <LangTheme />
        <GButton variant={ButtonVariantEnum.Secondary}>
          <Link href="/login">{t.backToHome}</Link>
        </GButton>
      </div>
      <GPage className="pt-0">
        <PageHeader icon={Activity} title={t.title} subtitle={t.subtitle} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <GSpinner size={SizeEnum.lg} />
          </div>
        ) : (
          <div className="space-y-4">
            <GCard padding={SizeEnum.None} className="divide-y divide-border/60 overflow-hidden">
              <ServiceRow icon={Server} label={t.backend} detail={health ? health.service : "-"} ok={backendOk} onlineLabel={t.online} offlineLabel={t.offline} />
              <ServiceRow
                icon={Globe}
                label={t.frontend}
                detail={typeof window !== "undefined" ? window.location.origin : "-"}
                ok={!error}
                onlineLabel={t.online}
                offlineLabel={t.offline}
              />
              <ServiceRow icon={Database} label={t.database} detail={databaseOk ? t.online : t.offline} ok={databaseOk} onlineLabel={t.online} offlineLabel={t.offline} />
            </GCard>

            <GCard padding={SizeEnum.md}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-text-secondary">
                  <p>
                    {t.uptime}: <span className="font-semibold text-text">{health ? formatUptime(health.uptimeSeconds) : "-"}</span>
                  </p>
                  <p className="mt-1">
                    {t.checkedAt}: <span className="font-semibold text-text">{checkedAt}</span>
                  </p>
                </div>
                <GButtonAsync variant={ButtonVariantEnum.Secondary} onClick={check} startIcon={<GIcon icon={RefreshCw} size={SizeEnum.sm} />}>
                  {t.refresh}
                </GButtonAsync>
              </div>
            </GCard>
          </div>
        )}
      </GPage>
    </div>
  );
}

export default HealthPage;
