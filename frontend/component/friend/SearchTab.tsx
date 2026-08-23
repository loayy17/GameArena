"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Filter, Search, UserPlus, X } from "lucide-react";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/friends/i18n/fr.i18n";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GSelect } from "@/component/common/GSelect";
import { GAsync } from "@/component/common/GAsync";
import { GTextField } from "@/component/common/GTextField";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";
import { useTranslation } from "@/hooks/useSetting";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { SEARCH_DEBOUNCE_MS } from "@/domain/constant/debounce";
import { friendService } from "@/services/def/FriendService";
import { userService } from "@/services/def/UserService";

const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
};

const displayName = (user: IUserSummary, fallback: string) =>
  user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName || fallback);

function SearchTab() {
  const t = useTranslation({ en, ar, fr }) as TFriendsTranslation;
  const resolveError = useErrorMessage();
  const { friends, requests, sentRequests, blockedUsers } = useDashboardData();
  const [userFilter, setUserFilter] = useState<IUserFilterRequest>(defaultFilter);
  const [searchUsers, setSearchUsers] = useState<IUserSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<TNullable<string>>(null);
  const [actionError, setActionError] = useState<TNullable<string>>(null);
  const [sendingId, setSendingId] = useState<TNullable<string>>(null);

  const query = userFilter.name?.trim() ?? "";
  const status = userFilter.userStatus;

  useEffect(() => {
    let ignore = false;

    const performSearch = async () => {
      if (!query) {
        if (!ignore) {
          setSearchUsers([]);
          setSearchError(null);
          setSearching(false);
        }
        return;
      }

      if (!ignore) setSearching(true);
      if (!ignore) setSearchError(null);

      try {
        const usersRes = await userService.list({ name: query, userStatus: status });
        if (!ignore) setSearchUsers(usersRes.data ?? []);
      } catch (e: unknown) {
        if (!ignore) {
          setSearchUsers([]);
          setSearchError(resolveError(toErrorCode(e), t.searchTab.searchError));
        }
      } finally {
        if (!ignore) setSearching(false);
      }
    };

    const timer = window.setTimeout(() => {
      void performSearch();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      ignore = true;
    };
  }, [query, status, t.searchTab.searchError, resolveError]);

  const searchResults = useMemo(() => {
    const friendIds = new Set(friends.map((f) => f.id));
    const blockedIds = new Set(blockedUsers.map((b) => b.id));
    const sentIds = new Set(sentRequests.map((r) => r.receiverId));
    const incomingIds = new Set(requests.map((r) => r.senderId));
    return searchUsers
      .filter((user) => !friendIds.has(user.id) && !blockedIds.has(user.id))
      .map((user) => ({
        ...user,
        isSendRequest: sentIds.has(user.id),
        isIncomingRequest: incomingIds.has(user.id),
      }));
  }, [searchUsers, friends, blockedUsers, sentRequests, requests]);

  const handleSendRequest = async (receiverId: string) => {
    setSendingId(receiverId);
    setActionError(null);
    try {
      await friendService.sendFriendRequest(receiverId);
    } catch (e: unknown) {
      setActionError(resolveError(toErrorCode(e), t.searchTab.sendError));
    }
    setSendingId(null);
  };

  const handleAcceptRequest = async (senderId: string) => {
    setSendingId(senderId);
    setActionError(null);
    try {
      await friendService.acceptFriendRequest(senderId);
      setSearchUsers((prev) => prev.filter((user) => user.id !== senderId));
    } catch (e: unknown) {
      setActionError(resolveError(toErrorCode(e), t.searchTab.sendError));
    }
    setSendingId(null);
  };

  const clearSearch = () => {
    setUserFilter(defaultFilter);
    setSearchUsers([]);
    setSearchError(null);
    setActionError(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] items-end">
        <GTextField
          id="search"
          value={userFilter.name ?? ""}
          onChange={(e) => setUserFilter((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={t.searchTab.placeholder}
          startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
          endIcon={
            userFilter.name && (
              <GButton
                type="button"
                onClick={clearSearch}
                aria-label={t.searchTab.clearSearch}
                variant={ButtonVariantEnum.Subtle}
                size={SizeEnum.xs}
                className="p-0 text-text-muted hover:text-text">
                <GIcon icon={X} size={SizeEnum.sm} color={AccentColorEnum.Muted} flip={false} />
              </GButton>
            )
          }
        />

        <GSelect
          startIcon={<GIcon icon={Filter} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
          value={userFilter.userStatus}
          onChange={(e) =>
            setUserFilter((prev) => ({
              ...prev,
              userStatus: +e.target.value as UserStatusEnum,
            }))
          }
          options={[
            { value: UserStatusEnum.All, label: t.searchTab.allStatuses },
            { value: UserStatusEnum.Online, label: t.searchTab.online },
            { value: UserStatusEnum.Offline, label: t.searchTab.offline },
            { value: UserStatusEnum.InGame, label: t.searchTab.inGame },
          ]}
        />
      </div>

      <p className="text-xs text-text-muted">{t.searchTab.hint}</p>

      <GAsync loading={searching} error={query ? searchError : undefined} className="py-12">
        {query ? (
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <GCard padding={SizeEnum.lg} className="text-center text-sm text-text-muted">
                {t.searchTab.noResults}
              </GCard>
            ) : (
              <GCard padding={SizeEnum.None} className="overflow-hidden">
                <GList items={searchResults} keyExtractor={(user) => user.id} pageSize={10} listClassName="divide-y divide-border/60">
                  {(user) => (
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <Link
                        href={`/profile/${user.id}`}
                        className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                        <GAvatar
                          firstName={user.firstName}
                          lastName={user.lastName}
                          avatarUrl={user.avatarUrl}
                          status={user.status}
                          size={SizeEnum.sm}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text">{displayName(user, t.searchTab.unknownUser)}</p>
                          <p className="truncate text-xs text-text-muted">{user.userName ? `@${user.userName}` : t.searchTab.noUsername}</p>
                        </div>
                      </Link>

                      {user.isIncomingRequest ? (
                        <GButtonAsync
                          onClick={() => void handleAcceptRequest(user.id)}
                          size={SizeEnum.sm}
                          variant={ButtonVariantEnum.Primary}
                          busy={sendingId === user.id}
                          disabled={sendingId !== null}
                          startIcon={<GIcon icon={Check} size={SizeEnum.sm} className="text-on-primary" />}>
                          {t.requestsTab.accept}
                        </GButtonAsync>
                      ) : user.isSendRequest ? (
                        <GBadge variant={AccentColorEnum.Muted}>{t.searchTab.requestSent}</GBadge>
                      ) : (
                        <GButtonAsync
                          onClick={() => void handleSendRequest(user.id)}
                          size={SizeEnum.sm}
                          variant={ButtonVariantEnum.Primary}
                          busy={sendingId === user.id}
                          disabled={sendingId !== null}
                          startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} className="text-on-primary" />}>
                          {t.searchTab.add}
                        </GButtonAsync>
                      )}
                    </div>
                  )}
                </GList>
              </GCard>
            )}
            {actionError && (
              <p className="text-xs text-danger" role="alert">
                {actionError}
              </p>
            )}
          </div>
        ) : (
          <GCard variant={CardVariantEnum.Outlined} padding={SizeEnum.lg} className="text-center text-sm text-text-muted border-dashed">
            {t.searchTab.emptyHint}
          </GCard>
        )}
      </GAsync>
    </div>
  );
}

export { SearchTab };
