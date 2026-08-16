"use client";

import { useEffect, useState } from "react";
import { Filter, Search, UserPlus, X } from "lucide-react";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/friends/i18n/fr.i18n";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
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

import type { ISearchResult } from "./def/SearchTab";

const defaultFilter: IUserFilterRequest = {
  name: "",
  userStatus: UserStatusEnum.All,
};

const displayName = (user: IUserSummary, fallback: string) =>
  user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName || fallback);

function SearchTab() {
  const t = useTranslation({ en, ar, fr }) as TFriendsTranslation;
  const resolveError = useErrorMessage();
  const [userFilter, setUserFilter] = useState<IUserFilterRequest>(defaultFilter);
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<TNullable<string>>(null);

  const query = userFilter.name?.trim() ?? "";

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
          friendService.getFriends(userFilter),
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
      } catch (e: unknown) {
        if (!ignore) {
          setSearchResults([]);
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
  }, [query, userFilter, t.searchTab.searchError, resolveError]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      await friendService.sendFriendRequest(receiverId);
      setSearchResults((prev) => prev.map((user) => (user.id === receiverId ? { ...user, isSendRequest: true } : user)));
    } catch (e: unknown) {
      setSearchError(resolveError(toErrorCode(e), t.searchTab.sendError));
    }
  };

  const clearSearch = () => {
    setUserFilter(defaultFilter);
    setSearchResults([]);
    setSearchError(null);
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
                className="p-0! text-text-muted hover:text-text">
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
              <GList items={searchResults} keyExtractor={(user) => user.id} pageSize={10} listClassName="gap-3">
                {(user) => (
                  <GCard padding={SizeEnum.sm} className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size={SizeEnum.sm} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-text">{displayName(user, t.searchTab.unknownUser)}</p>
                        <p className="truncate text-xs text-text-muted">{user.userName ? `@${user.userName}` : t.searchTab.noUsername}</p>
                      </div>
                    </div>

                    {user.isSendRequest ? (
                      <GBadge variant={AccentColorEnum.Muted}>{t.searchTab.requestSent}</GBadge>
                    ) : (
                      <GButton
                        onClick={() => void handleSendRequest(user.id)}
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Primary}
                        startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} className="text-on-primary" />}>
                        {t.searchTab.add}
                      </GButton>
                    )}
                  </GCard>
                )}
              </GList>
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
