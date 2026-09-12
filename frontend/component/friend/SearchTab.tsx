"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Check, Filter, UserPlus, X } from "lucide-react";

import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/friends/i18n/fr.i18n";
import { en } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GSelect } from "@/component/common/GSelect";
import { GAsync } from "@/component/common/GAsync";
import { GSearchField } from "@/component/common/GSearchField";
import { GUserRow } from "@/component/user/GUserRow";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useTranslation } from "@/hooks/useSetting";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { friendService } from "@/services/def/FriendService";
import { userService } from "@/services/def/UserService";
import { UserRoleEnum } from "@/domain/enum/UserRoleEnum";
import type { TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";


const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
  userRole: UserRoleEnum.All,
};

function SearchTab() {
  const t = useTranslation<TFriendsTranslation>({ en, ar, fr });
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
  const debouncedQuery = useDebouncedValue(query, 500);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const performSearch = async () => {
      if (!debouncedQuery) {
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
        const usersRes = await userService.list(
          { name: debouncedQuery, userStatus: status, userRole: UserRoleEnum.All },
          { signal: controller.signal },
        );
        if (!ignore) setSearchUsers(usersRes.data ?? []);
      } catch (e: unknown) {
        if (axios.isCancel(e)) return;
        if (!ignore) {
          setSearchUsers([]);
          setSearchError(resolveError(toErrorCode(e), t.searchTab.searchError));
        }
      } finally {
        if (!ignore) setSearching(false);
      }
    };

    void performSearch();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [debouncedQuery, status, t.searchTab.searchError, resolveError]);

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
        <GSearchField
          id="search"
          value={userFilter.name ?? ""}
          onChange={(e) => setUserFilter((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={t.searchTab.placeholder}
          endIcon={
            userFilter.name && (
              <GButton
                type="button"
                icon={X}
                label={t.searchTab.clearSearch}
                variant={ButtonVariantEnum.Subtle}
                size={SizeEnum.xs}
                onClick={clearSearch}
                className="p-0 text-text-muted hover:text-text"
              />
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

      <GAsync loading={searching} error={query ? searchError : undefined} errorTitle={t.error.title} retryLabel={t.error.retry} className="py-12">
        {query ? (
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <GCard className="text-center text-sm text-text-muted p-6">{t.searchTab.noResults}</GCard>
            ) : (
              <GCard className="p-0">
                <GList items={searchResults} keyExtractor={(user) => user.id} pageSize={10} listClassName="divide-y divide-border/60">
                  {(user) => (
                    <GUserRow
                      user={user}
                      href={`/profile/${user.id}`}
                      query={query}
                      className="px-4 py-3"
                      trailing={
                        user.isIncomingRequest ? (
                          <GButton
                            type="button"
                            onClick={() => handleAcceptRequest(user.id)}
                            size={SizeEnum.sm}
                            variant={ButtonVariantEnum.Primary}
                            disabled={sendingId !== null}
                            startIcon={<GIcon icon={Check} size={SizeEnum.sm} className="text-on-primary" />}>
                            {t.requestsTab.accept}
                          </GButton>
                        ) : user.isSendRequest ? (
                          <GBadge variant={AccentColorEnum.Muted}>{t.searchTab.requestSent}</GBadge>
                        ) : (
                          <GButton
                            type="button"
                            onClick={() => handleSendRequest(user.id)}
                            size={SizeEnum.sm}
                            variant={ButtonVariantEnum.Primary}
                            disabled={sendingId !== null}
                            startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} className="text-on-primary" />}>
                            {t.searchTab.add}
                          </GButton>
                        )
                      }
                    />
                  )}
                </GList>
              </GCard>
            )}
            {actionError && <GAlert severity={AccentColorEnum.Danger}>{actionError}</GAlert>}
          </div>
        ) : (
          <GCard variant={CardVariantEnum.Outlined} className="text-center text-sm text-text-muted border-dashed p-6">
            {t.searchTab.emptyHint}
          </GCard>
        )}
      </GAsync>
    </div>
  );
}

export { SearchTab };
