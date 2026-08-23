"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Trophy,
  Swords,
  Minus,
  Percent,
  Calendar,
  ArrowLeft,
  AlertTriangle,
  Medal,
  UserPlus,
  UserMinus,
  Check,
  X,
  ShieldOff,
  MessageSquare,
  Pencil,
  Share2,
} from "lucide-react";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { userService } from "@/services/def/UserService";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GAvatar } from "@/component/common/GAvatar";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GList } from "@/component/common/GList";
import { GSpinner } from "@/component/common/GSpinner";
import { MatchHistoryTable } from "@/component/history/MatchHistoryTable";
import { MatchHistoryItem } from "@/component/history/MatchHistoryItem";
import { PageHeader } from "@/component/common/PageHeader";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { en as GameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as GameAr } from "@/component/i18n/Game/ar.i18n";
import { fr as GameFr } from "@/component/i18n/Game/fr.i18n";
import { en, type TUserProfileTranslation } from "../i18n/en.i18n";
import { ar } from "../i18n/ar.i18n";
import { fr } from "../i18n/fr.i18n";
import type { IUserPublicProfile } from "@/domain/meta/IUserPublicProfile";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";

type ProfileRelationship = "self" | "none" | "sent" | "received" | "friend" | "blocked";

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.lg} className="flex items-center gap-3">
      <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-text leading-tight">{value}</p>
        <p className="text-xs text-text-muted truncate">{label}</p>
      </div>
    </GCard>
  );
}

function ProfileRelationshipActions({ profileId, userId, t }: { profileId: string; userId: TNullable<string>; t: TUserProfileTranslation }) {
  const errorMessage = useErrorMessage();
  const {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    loading: dataLoading,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    unblockUser,
  } = useDashboardData();
  const [busy, setBusy] = useState<TNullable<string>>(null);
  const [actionError, setActionError] = useState<TNullable<string>>(null);
  const router = useRouter();

  const relation = useMemo<ProfileRelationship | null>(() => {
    if (!userId) return "none";
    if (profileId === userId) return "self";
    if (blockedUsers.some((b) => b.id === profileId)) return "blocked";
    if (requests.some((r) => r.senderId === profileId)) return "received";
    if (sentRequests.some((r) => r.receiverId === profileId)) return "sent";
    if (friends.some((f) => f.id === profileId)) return "friend";
    return "none";
  }, [profileId, userId, friends, requests, sentRequests, blockedUsers]);

  const runAction = async (key: string, action: () => Promise<void>) => {
    setBusy(key);
    setActionError(null);
    try {
      await action();
    } catch (e: unknown) {
      setActionError(errorMessage(toErrorCode(e)));
    }
    setBusy(null);
  };

  if (dataLoading && relation !== "self") {
    return (
      <GAsync loading>
        <GSpinner size={SizeEnum.sm} />
      </GAsync>
    );
  }

  if (relation === null) {
    return <GSpinner size={SizeEnum.sm} />;
  }

  return (
    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
      {relation === "self" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          rounded={SizeEnum.sm}
          startIcon={<GIcon icon={Pencil} size={SizeEnum.sm} />}
          onClick={() => router.push("/settings")}>
          {t.actions.editProfile}
        </GButton>
      )}
      {relation === "none" && (
        <GButtonAsync
          variant={ButtonVariantEnum.Secondary}
          rounded={SizeEnum.sm}
          busy={busy === "add"}
          loadingText={t.actions.loading}
          startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}
          onClick={() => runAction("add", () => sendRequest(profileId))}>
          {t.actions.addFriend}
        </GButtonAsync>
      )}
      {relation === "sent" && (
        <GButtonAsync
          variant={ButtonVariantEnum.Secondary}
          rounded={SizeEnum.sm}
          busy={busy === "unsend"}
          loadingText={t.actions.loading}
          startIcon={<GIcon icon={UserMinus} size={SizeEnum.sm} />}
          onClick={() => runAction("unsend", () => cancelRequest(profileId))}>
          {t.actions.unsend}
        </GButtonAsync>
      )}
      {relation === "received" && (
        <div className="flex flex-wrap justify-center gap-2">
          <GButtonAsync
            variant={ButtonVariantEnum.Primary}
            rounded={SizeEnum.sm}
            busy={busy === "accept"}
            loadingText={t.actions.loading}
            startIcon={<GIcon icon={Check} size={SizeEnum.sm} />}
            onClick={() => runAction("accept", () => acceptRequest(profileId))}>
            {t.actions.accept}
          </GButtonAsync>
          <GButtonAsync
            variant={ButtonVariantEnum.Secondary}
            rounded={SizeEnum.sm}
            busy={busy === "decline"}
            loadingText={t.actions.loading}
            startIcon={<GIcon icon={X} size={SizeEnum.sm} />}
            onClick={() => runAction("decline", () => declineRequest(profileId))}>
            {t.actions.decline}
          </GButtonAsync>
        </div>
      )}
      {relation === "friend" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          rounded={SizeEnum.sm}
          startIcon={<GIcon icon={MessageSquare} size={SizeEnum.sm} />}
          onClick={() => router.push(`/messages?friend=${profileId}`)}>
          {t.actions.message}
        </GButton>
      )}
      {relation === "blocked" && (
        <GButtonAsync
          variant={ButtonVariantEnum.Secondary}
          rounded={SizeEnum.sm}
          busy={busy === "unblock"}
          loadingText={t.actions.loading}
          startIcon={<GIcon icon={ShieldOff} size={SizeEnum.sm} />}
          onClick={() => runAction("unblock", () => unblockUser(profileId))}>
          {t.actions.unblock}
        </GButtonAsync>
      )}
      {actionError && (
        <p className="text-xs text-danger" role="alert">
          {actionError}
        </p>
      )}
    </div>
  );
}

function ProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [locale] = useLocale();
  const t = useTranslation({ en, ar, fr }) as TUserProfileTranslation;
  const gameT = useTranslation<GameTranslations>({ en: GameEn, ar: GameAr, fr: GameFr });
  const { user } = useAuth();

  const [profile, setProfile] = useState<TNullable<IUserPublicProfile>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<TNullable<string>>(null);
  const copiedTimerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);

  useEffect(() => {
    let alive = true;
    userService
      .publicProfile(params.id)
      .then((res) => {
        if (!alive) return;
        if (res.data) setProfile(res.data);
        else setError(t.errorDescription);
      })
      .catch(() => {
        if (alive) setError(t.errorDescription);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [params.id, attempt, t]);

  const reloadProfile = () => {
    setLoading(true);
    setError(null);
    setAttempt((a) => a + 1);
  };

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

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

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
        <GButton
          variant={ButtonVariantEnum.Subtle}
          rounded={SizeEnum.sm}
          onClick={() => router.push("/home")}
          startIcon={<GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />}>
          {t.back}
        </GButton>
      </div>

      <PageHeader icon={User} title={t.title} />

      <GAsync
        loading={loading}
        error={error}
        spinnerSize={SizeEnum.lg}
        errorTitle={t.errorTitle}
        errorIcon={AlertTriangle}
        retryLabel={t.retry}
        onRetry={reloadProfile}
        className="py-16">
        {profile && (
          <div className="space-y-6">
            <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="flex flex-col sm:flex-row items-center gap-6">
              <GAvatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                avatarUrl={profile.avatarUrl}
                status={profile.status}
                size={SizeEnum.xl}
              />
              <div className="flex-1 text-center sm:text-start w-full">
                <h2 className="text-2xl font-bold text-text">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-text-secondary mt-1">@{profile.userName}</p>
                <p className="inline-flex items-center gap-1.5 text-xs text-text-muted mt-3">
                  <GIcon icon={Calendar} size={SizeEnum.sm} />
                  {t.memberSince} {new Date(profile.createdAt).toLocaleDateString(locale)}
                </p>
                <div className="mt-4 rounded-xl border border-border/60 bg-surface px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text">
                      <GIcon icon={Medal} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
                      {t.level} {level}
                    </span>
                    <span className="text-xs text-text-muted tabular-nums">{levelProgress}%</span>
                  </div>
                  <div
                    className="mt-2 h-1.5 rounded-full bg-border overflow-hidden"
                    role="progressbar"
                    aria-valuenow={levelProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${levelProgress}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                <ProfileRelationshipActions key={profile.id} profileId={profile.id} userId={user?.id ?? null} t={t} />
                <GButtonAsync
                  variant={ButtonVariantEnum.Subtle}
                  rounded={SizeEnum.sm}
                  startIcon={<GIcon icon={Share2} size={SizeEnum.sm} />}
                  onClick={() => handleShare()}>
                  {copied ? t.actions.linkCopied : t.actions.share}
                </GButtonAsync>
                {shareError && (
                  <p className="text-xs text-danger" role="alert">
                    {shareError}
                  </p>
                )}
              </div>
            </GCard>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard icon={<GIcon icon={Swords} size={SizeEnum.md} />} label={t.stats.total} value={profile.totalMatches} />
              <StatCard icon={<GIcon icon={Trophy} size={SizeEnum.md} />} label={t.stats.wins} value={profile.wins} />
              <StatCard icon={<GIcon icon={User} size={SizeEnum.md} />} label={t.stats.losses} value={profile.losses} />
              <StatCard icon={<GIcon icon={Minus} size={SizeEnum.md} />} label={t.stats.draws} value={profile.draws} />
              <StatCard icon={<GIcon icon={Percent} size={SizeEnum.md} />} label={t.stats.winRate} value={`${profile.winRate}%`} />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text">{t.recentMatches}</h3>
              {profile.recentMatches.length === 0 ? (
                <GEmpty icon={<GIcon icon={Swords} size={SizeEnum.xl} color={AccentColorEnum.Muted} />} title={t.noMatches} description="" />
              ) : (
                <>
                  <div className="hidden sm:block overflow-x-auto">
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
            </div>
          </div>
        )}
      </GAsync>
    </GPage>
  );
}

export default ProfilePage;
