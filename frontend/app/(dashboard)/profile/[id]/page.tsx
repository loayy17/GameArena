"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Calendar, Medal, Minus, Percent, Share2, Swords, Trophy, User } from "lucide-react";

import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useAuth } from "@/app/providers/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { GList } from "@/component/common/GList";
import { GAvatar } from "@/component/common/GAvatar";
import { StatCard } from "@/component/profile/StatCard";
import { ProfileRelationshipActions } from "@/component/profile/ProfileRelationshipActions";
import { MatchHistoryTable } from "@/component/history/MatchHistoryTable";
import { MatchHistoryItem } from "@/component/history/MatchHistoryItem";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { withFullName } from "@/domain/lib/userUtils";
import { en as GameEn } from "@/component/i18n/Game/en.i18n";
import { ar as GameAr } from "@/component/i18n/Game/ar.i18n";
import { fr as GameFr } from "@/component/i18n/Game/fr.i18n";

import { en } from "../i18n/en.i18n";
import { ar } from "../i18n/ar.i18n";
import { fr } from "../i18n/fr.i18n";

import type { GameTranslations } from "@/component/i18n/Game/en.i18n";
import type { TUserProfileTranslation } from "../i18n/en.i18n";
import type { TNullable } from "@/domain/type/TCommon";

function ProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [locale] = useLocale();
  const t = useTranslation<TUserProfileTranslation>({ en, ar, fr });
  const gameT = useTranslation<GameTranslations>({ en: GameEn, ar: GameAr, fr: GameFr });
  const { user } = useAuth();
  const { profile, loading, error, reload } = useUserProfile(params.id, t.errorDescription);

  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<TNullable<string>>(null);
  const copiedTimerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const handleShare = async () => {
    setShareError(null);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError(t.shareFailed);
    }
  };

  const gameLabels = useMemo<Record<GamesKindEnum, string>>(
    () => ({
      [GamesKindEnum.TicTacToe]: gameT.tictactoe.name,
      [GamesKindEnum.Snake]: gameT.snake.name,
      [GamesKindEnum.PingPong]: gameT.pingpong.name,
      [GamesKindEnum.RockPaperScissors]: gameT.rockpaperscissors.name,
      [GamesKindEnum.ConnectFour]: gameT.connectfour.name,
    }),
    [gameT],
  );

  const level = Math.floor(profile?.rank ?? 0);
  const levelProgress = Math.round(((profile?.rank ?? 0) - level) * 100);

  return (
    <GPage size={SizeEnum.lg}>
      <div className="mb-3">
        <GButton variant={ButtonVariantEnum.Subtle} className="rounded-md" onClick={() => router.push("/home")} startIcon={<GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />}>
          {t.back}
        </GButton>
      </div>

      <GAsync
        loading={loading}
        error={error}
        spinnerSize={SizeEnum.lg}
        errorTitle={t.errorTitle}
        errorIcon={AlertTriangle}
        retryLabel={t.retry}
        onRetry={reload}
        className="py-16">
        {profile && (
          <div className="space-y-6">
            <GCard variant={CardVariantEnum.Elevated} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/25 via-accent/15 to-transparent" aria-hidden />
              <div className="flex flex-col gap-6 px-6 pb-6 sm:flex-row sm:items-start sm:px-8 sm:pb-8">
                <div className="-mt-12 shrink-0 self-center rounded-full ring-4 ring-bg-card sm:self-auto">
                  <GAvatar user={profile} size={SizeEnum.xl} />
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-start">
                  <h1 className="text-2xl font-bold text-text">
                    {withFullName(profile).fullName}
                  </h1>
                  <p className="mt-0.5 text-sm text-text-secondary">@{profile.userName}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
                    <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                      <GIcon icon={Calendar} size={SizeEnum.sm} />
                      {t.memberSince} {new Date(profile.createdAt).toLocaleDateString(locale)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-muted px-2.5 py-1 text-xs font-semibold text-primary">
                      <GIcon icon={Medal} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
                      {t.level} {level}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={levelProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${t.level} ${level}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${levelProgress}%` }} />
                    </div>
                    <span className="shrink-0 text-xs text-text-muted tabular-nums">{levelProgress}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:w-52">
                  <ProfileRelationshipActions key={profile.id} profileId={profile.id} userId={user?.id ?? null} t={t} />
                  <GButton variant={ButtonVariantEnum.Subtle} startIcon={<GIcon icon={Share2} size={SizeEnum.sm} />} onClick={() => handleShare()}>
                    {copied ? t.actions.linkCopied : t.actions.share}
                  </GButton>
                  {shareError && <GAlert severity={AccentColorEnum.Danger}>{shareError}</GAlert>}
                </div>
              </div>
            </GCard>

            <section aria-label={t.stats.total}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard icon={Swords} label={t.stats.total} value={profile.totalMatches} />
                <StatCard icon={Trophy} label={t.stats.wins} value={profile.wins} />
                <StatCard icon={User} label={t.stats.losses} value={profile.losses} />
                <StatCard icon={Minus} label={t.stats.draws} value={profile.draws} />
                <StatCard className="col-span-2 sm:col-span-1" icon={Percent} label={t.stats.winRate} value={`${profile.winRate}%`} />
              </div>
            </section>

            <section className="space-y-3" aria-label={t.recentMatches}>
              <h2 className="text-lg font-semibold text-text">{t.recentMatches}</h2>
              {profile.recentMatches.length === 0 ? (
                <GEmpty icon={<GIcon icon={Swords} size={SizeEnum.xl} color={AccentColorEnum.Muted} />} title={t.noMatches} description={t.noMatchesDescription} />
              ) : (
                <>
                  <div className="hidden overflow-x-auto sm:block">
                    <MatchHistoryTable
                      matches={profile.recentMatches}
                      locale={locale}
                      winLabel={t.stats.wins}
                      lossLabel={t.stats.losses}
                      drawLabel={t.stats.draws}
                      gameLabels={gameLabels}
                    />
                  </div>
                  <div className="sm:hidden">
                    <GList items={profile.recentMatches} keyExtractor={(match) => match.id} pageSize={10} listClassName="gap-3">
                      {(match) => (
                        <MatchHistoryItem
                          match={match}
                          locale={locale}
                          winLabel={t.stats.wins}
                          lossLabel={t.stats.losses}
                          drawLabel={t.stats.draws}
                          versusLabel={t.versus}
                          gameLabel={gameLabels[match.kind]}
                        />
                      )}
                    </GList>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </GAsync>
    </GPage>
  );
}

export default ProfilePage;
