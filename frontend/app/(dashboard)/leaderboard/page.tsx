"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Trophy } from "lucide-react";
import axios from "axios";
import Link from "next/link";

import { useTranslation } from "@/hooks/useSetting";
import { useAuth } from "@/app/providers/AuthProvider";
import { userService } from "@/services/def/UserService";
import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GCard } from "@/component/common/GCard";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GPage } from "@/component/common/GPage";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GAsync } from "@/component/common/GAsync";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { cn } from "@/lib/cn";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { TLeaderboardTranslation } from "./i18n/en.i18n";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

const rankMedal = (position: number): TNullable<AccentColorEnum> => {
  if (position === 0) return AccentColorEnum.Warning;
  if (position === 1) return AccentColorEnum.Muted;
  if (position === 2) return AccentColorEnum.Danger;
  return null;
};

function LeaderboardPage() {
  const t = useTranslation<TLeaderboardTranslation>({ en, ar, fr });
  const resolveError = useErrorMessage();
  const { user } = useAuth();

  const [players, setPlayers] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    const timer = setTimeout(() => {
      setLoading(true);
      userService
        .getLeaderboard(20, { signal: controller.signal })
        .then((res) => {
          if (!ignore) {
            setPlayers(res.data ?? []);
            setError(null);
          }
        })
        .catch((e: unknown) => {
          if (axios.isCancel(e) || ignore) return;
          setError(resolveError(toErrorCode(e), t.errorTitle));
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey, resolveError, t.errorTitle]);

  return (
    <GPage size={SizeEnum.lg}>
      <GPageHeader
        icon={Trophy}
        title={t.title}
        subtitle={t.subtitle}
        className="hidden md:block"
        badge={
          <GBadge>
            <GIcon icon={Trophy} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.badge}
          </GBadge>
        }
      />

      <GAsync
        loading={loading}
        error={error}
        spinnerSize={SizeEnum.lg}
        errorTitle={t.errorTitle}
        errorIcon={AlertTriangle}
        retryLabel={t.retry}
        onRetry={reload}
        className="py-16">
        {players.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={Trophy} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : (
          <GCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 text-center font-medium">{t.rank}</th>
                    <th className="px-4 py-3 text-start font-medium">{t.player}</th>
                    <th className="px-4 py-3 text-center font-medium">{t.level}</th>
                    <th className="px-4 py-3 text-center font-medium">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => {
                    const level = Math.floor(player.rank ?? 0);
                    const medal = rankMedal(index);
                    const isMe = player.id === user?.id;

                    return (
                      <tr key={player.id} className="border-b border-border/60 last:border-0 transition-colors hover:bg-surface-hover">
                        <td className="px-4 py-3 text-center">
                          {medal ? (
                            <GBadge variant={medal} size={SizeEnum.sm}>
                              {index + 1}
                            </GBadge>
                          ) : (
                            <span className="text-text-muted">#{index + 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/profile/${player.id}`} className="flex items-center gap-3 rounded-lg">
                            <GAvatar user={player} size={SizeEnum.xs} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-text">
                                {player.fullName?.trim() || player.userName || player.id}
                                {isMe && <span className="ms-1.5 text-xs font-medium text-primary">({t.you})</span>}
                              </p>
                              <p className="truncate text-xs text-text-muted">@{player.userName}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <GBadge size={SizeEnum.sm}>
                            {level} <span className="text-text-muted">· {Math.round(((player.rank ?? 0) - level) * 100)}%</span>
                          </GBadge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            title={player.status === UserStatusEnum.Online ? t.status : undefined}
                            className={cn(
                              "inline-block size-2.5 rounded-full",
                              player.status === UserStatusEnum.Online
                                ? "bg-success"
                                : player.status === UserStatusEnum.InGame
                                  ? "bg-accent"
                                  : "bg-text-muted",
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GCard>
        )}
      </GAsync>
    </GPage>
  );
}

export default LeaderboardPage;