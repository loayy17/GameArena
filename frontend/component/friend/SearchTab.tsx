"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Search, UserPlus, X } from "lucide-react";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUser } from "@/domain/meta/IUser";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { userService } from "@/services/def/UserService";

type TSearchResult = IUser & {
  isSendRequest: boolean;
};

const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
};

const displayName = (user: IUser) =>
  user.fullName ??
  ([user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.userName ||
    "Unknown user");

function SearchTab() {
  const [userFilter, setUserFilter] =
    useState<IUserFilterRequest>(defaultFilter);
  const [searchResults, setSearchResults] = useState<TSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const query = useMemo(() => userFilter.name?.trim() ?? "", [userFilter.name]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!query) {
        setSearchResults([]);
        setSearchError(null);
        setSearching(false);
        return;
      }

      setSearching(true);
      setSearchError(null);

      try {
        const [usersRes, sentRes] = await Promise.all([
          userService.list(userFilter),
          friendService.getSentFriendRequests(),
        ]);

        const sentIds = new Set(
          (sentRes.data ?? []).map((request) => request.receiverId),
        );

        setSearchResults(
          (usersRes.data ?? []).map((user) => ({
            ...user,
            isSendRequest: sentIds.has(user.id),
          })),
        );
      } catch (err) {
        console.error("Failed to search users", err);
        setSearchResults([]);
        setSearchError("Failed to search users. Please try again.");
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
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
      setSearchError("Failed to send request. Please try again.");
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={userFilter.name ?? ""}
            onChange={(e) =>
              setUserFilter((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-2xl border border-border bg-bg-card px-10 py-3 text-sm text-white outline-none transition focus:border-primary"
          />
          {userFilter.name && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <select
              value={userFilter.userStatus}
              onChange={(e) =>
                setUserFilter((prev) => ({
                  ...prev,
                  userStatus: Number(e.target.value) as UserStatusEnum,
                }))
              }
              className="min-w-40 appearance-none rounded-2xl border border-border bg-bg-card py-3 pl-9 pr-8 text-sm text-white outline-none transition focus:border-primary"
            >
              <option value={UserStatusEnum.All}>All Statuses</option>
              <option value={UserStatusEnum.Online}>Online</option>
              <option value={UserStatusEnum.Offline}>Offline</option>
              <option value={UserStatusEnum.InGame}>In Game</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Start typing a name or email to search available users.
      </p>

      {searchError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
          {searchError}
        </div>
      )}

      {searching ? (
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : query ? (
        <div className="space-y-3">
          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-border bg-bg-card/70 px-4 py-8 text-center text-sm text-text-muted">
              No users matched your search.
            </div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-bg-card/70 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {displayName(user)}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {user.userName ? `@${user.userName}` : "No username"}
                  </p>
                </div>

                {user.isSendRequest ? (
                  <span className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-text-muted">
                    Request Sent
                  </span>
                ) : (
                  <button
                    onClick={() => void handleSendRequest(user.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-bg-card/40 px-4 py-10 text-center text-sm text-text-muted">
          Use the search field above to look up users.
        </div>
      )}
    </div>
  );
}

export { SearchTab };
