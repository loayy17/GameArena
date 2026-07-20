"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search, UserPlus, X } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { userService } from "@/services/def/UserService";
import { GButton } from "../common/GButton";
import { GSelect } from "../common/GSelect";
import { GSpinner } from "../common/GSpinner";
import { GCard } from "../common/GCard";
import { GBadge } from "../common/GBadge";
import { GAvatar } from "../common/GAvatar";
import { GIcon } from "../common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GTextField } from "../common/GTextField";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";
import type { TNullable } from "@/domain/type/TCommon";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { ISearchResult } from "./def/SearchTab";

const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
};

const displayName = (user: IUserSummary, fallback: string) =>
  user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName || fallback);

function SearchTab() {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const [userFilter, setUserFilter] = useState<IUserFilterRequest>(defaultFilter);
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<TNullable<string>>(null);

  const query = useMemo(() => userFilter.name?.trim() ?? "", [userFilter.name]);

  useEffect(() => {
    let ignore = false;

    const performSearch = async () => {
      if (!query) {
        if (!ignore) {
          setSearchResults([]);
          setSearchError(null);
          setSearching(false);
        }
        return;
      }

      if (!ignore) setSearching(true);
      if (!ignore) setSearchError(null);

      try {
        const [usersRes, sentRes, friendsRes] = await Promise.all([
          userService.list(userFilter),
          friendService.getSentFriendRequests(),
          friendService.getFriends({ name: "", userStatus: UserStatusEnum.All }),
        ]);

        const sentIds = new Set((sentRes.data ?? []).map((request: { receiverId: string }) => request.receiverId));

        const friendIds = new Set((friendsRes.data ?? []).map((friend: IUserSummary) => friend.id));

        if (!ignore) {
          setSearchResults(
            (usersRes.data ?? [])
              .filter((user: IUserSummary) => !friendIds.has(user.id))
              .map((user: IUserSummary) => ({
                ...user,
                isSendRequest: sentIds.has(user.id),
              })),
          );
        }
      } catch {
        if (!ignore) {
          setSearchResults([]);
          setSearchError(t.searchTab.searchError);
        }
      } finally {
        if (!ignore) setSearching(false);
      }
    };

    const timer = window.setTimeout(() => {
      void performSearch();
    }, 300);

    return () => {
      window.clearTimeout(timer);
      ignore = true;
    };
  }, [query, userFilter, t.searchTab.searchError]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      await friendService.sendFriendRequest(receiverId);
      setSearchResults((prev) => prev.map((user) => (user.id === receiverId ? { ...user, isSendRequest: true } : user)));
    } catch {
      setSearchError(t.searchTab.sendError);
    }
  };

  const clearSearch = () => {
    setUserFilter(defaultFilter);
    setSearchResults([]);
    setSearchError(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <GTextField
          id="search"
          value={userFilter.name ?? ""}
          onChange={(e) => setUserFilter((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={t.searchTab.placeholder}
          label={t.searchTab.add}
          startIcon={<GIcon icon={Search} size="sm" color="muted" />}
          endIcon={
            userFilter.name && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={t.searchTab.clearSearch || "Clear search"}
                className="text-text-muted hover:text-text">
                <GIcon icon={X} size="sm" color="muted" flip={false} />
              </button>
            )
          }
        />

        <GSelect
          startIcon={<GIcon icon={Filter} size="sm" color="muted" />}
          value={userFilter.userStatus}
          onChange={(e) =>
            setUserFilter((prev) => ({
              ...prev,
              userStatus: Number(e.target.value) as UserStatusEnum,
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

      {searchError && (
        <GCard padding="md" className="text-center text-sm text-danger border-danger/30">
          {searchError}
        </GCard>
      )}

      {searching ? (
        <div className="flex justify-center py-12">
          <GSpinner />
        </div>
      ) : query ? (
        <div className="space-y-3">
          {searchResults.length === 0 ? (
            <GCard padding="lg" className="text-center text-sm text-text-muted">
              {t.searchTab.noResults}
            </GCard>
          ) : (
            searchResults.map((user) => (
              <GCard key={user.id} padding="sm" className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size="sm" shape="circle" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{displayName(user, t.searchTab.unknownUser)}</p>
                    <p className="truncate text-xs text-text-muted">{user.userName ? `@${user.userName}` : t.searchTab.noUsername}</p>
                  </div>
                </div>

                {user.isSendRequest ? (
                  <GBadge variant="muted">{t.searchTab.requestSent}</GBadge>
                ) : (
                  <GButton
                    onClick={() => void handleSendRequest(user.id)}
                    size="sm"
                    leftIcon={<GIcon icon={UserPlus} size="sm" color="inherit" className="text-on-primary" />}>
                    {t.searchTab.add}
                  </GButton>
                )}
              </GCard>
            ))
          )}
        </div>
      ) : (
        <GCard variant="outlined" padding="lg" className="text-center text-sm text-text-muted border-dashed">
          {t.searchTab.emptyHint}
        </GCard>
      )}
    </div>
  );
}

export { SearchTab };
