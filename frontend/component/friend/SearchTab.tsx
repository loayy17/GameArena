"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, UserPlus } from "lucide-react";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUser } from "@/domain/meta/IUser";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { userService } from "@/services/def/UserService";
import { GButton } from "../common/GButton";
import { GInputSearch } from "../common/GInputSearch";
import { GSelect } from "../common/GSelect";
import { GSpinner } from "../common/GSpinner";
import { GErrorBanner } from "../common/GErrorBanner";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";

type TSearchResult = IUser & {
  isSendRequest: boolean;
};

const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
};

const displayName = (user: IUser, fallback: string) =>
  user.fullName ??
  ([user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.userName ||
    fallback);

function SearchTab() {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const [userFilter, setUserFilter] =
    useState<IUserFilterRequest>(defaultFilter);
  const [searchResults, setSearchResults] = useState<TSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const query = useMemo(() => userFilter.name?.trim() ?? "", [userFilter.name]);

  useEffect(() => {
    let ignore = false;
    const timer = window.setTimeout(async () => {
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
        const [usersRes, sentRes] = await Promise.all([
          userService.list(userFilter),
          friendService.getSentFriendRequests(),
        ]);

        const sentIds = new Set(
          (sentRes.data ?? []).map((request: { receiverId: string }) => request.receiverId),
        );

        if (!ignore) {
          setSearchResults(
            (usersRes.data ?? []).map((user: IUser) => ({
              ...user,
              isSendRequest: sentIds.has(user.id),
            })),
          );
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to search users", err);
          setSearchResults([]);
          setSearchError(t.searchTab.searchError);
        }
      } finally {
        if (!ignore) setSearching(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      ignore = true;
    };
  }, [query, userFilter]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      await friendService.sendFriendRequest(receiverId);
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === receiverId ? { ...user, isSendRequest: true } : user,
        ),
      );
    } catch (err) {
      console.error("Failed to send friend request", err);
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
        <GInputSearch
          value={userFilter.name ?? ""}
          onChange={(value) => setUserFilter((prev) => ({ ...prev, name: value }))}
          placeholder={t.searchTab.placeholder}
          onClear={clearSearch}
          clearLabel={t.searchTab.clearSearch}
        />

        <GSelect
          startIcon={<Filter className="h-4 w-4" />}
          value={userFilter.userStatus}
          onChange={(e) =>
            setUserFilter((prev) => ({
              ...prev,
              userStatus: Number(e.target.value) as UserStatusEnum,
            }))
          }
          className="min-w-40"
          options={[
            { value: UserStatusEnum.All, label: t.searchTab.allStatuses },
            { value: UserStatusEnum.Online, label: t.searchTab.online },
            { value: UserStatusEnum.Offline, label: t.searchTab.offline },
            { value: UserStatusEnum.InGame, label: t.searchTab.inGame },
          ]}
        />
      </div>

      <p className="text-xs text-text-muted">{t.searchTab.hint}</p>

      {searchError && <GErrorBanner message={searchError} />}

      {searching ? (
        <div className="flex justify-center py-12">
          <GSpinner />
        </div>
      ) : query ? (
        <div className="space-y-3">
          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-border bg-bg-card/70 px-4 py-8 text-center text-sm text-text-muted">
              {t.searchTab.noResults}
            </div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-bg-card/70 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">
                    {displayName(user, t.searchTab.unknownUser)}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {user.userName
                      ? `@${user.userName}`
                      : t.searchTab.noUsername}
                  </p>
                </div>

                {user.isSendRequest ? (
                  <span className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-text-muted">
                    {t.searchTab.requestSent}
                  </span>
                ) : (
                  <GButton
                    onClick={() => void handleSendRequest(user.id)}
                    size="sm"
                    leftIcon={<UserPlus className="h-4 w-4" />}
                  >
                    {t.searchTab.add}
                  </GButton>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-bg-card/40 px-4 py-10 text-center text-sm text-text-muted">
          {t.searchTab.emptyHint}
        </div>
      )}
    </div>
  );
}

export { SearchTab };
