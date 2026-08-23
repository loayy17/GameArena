"use client";

import { useMemo } from "react";
import { Bell, UsersRound } from "lucide-react";

import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GButton } from "@/component/common/GButton";
import { GAvatar } from "@/component/common/GAvatar";
import { GList } from "@/component/common/GList";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { SocialTabId } from "../social/SocialTabs";
import { SocialListItem } from "../social/SocialListItem";
import { GameInvitesList } from "./GameInvitesList";
import type { ISocialPanelContentProps } from "./def/SocialPanelContent";

function goToChat(router: ISocialPanelContentProps["router"], friendId: string, closeMobile: () => void) {
  router.push(`/messages?friend=${friendId}`);
  closeMobile();
}

function SocialPanelContent({
  router,
  activeTab,
  friends,
  gameInvites,
  requests,
  notifications,
  loading,
  searchQuery,
  closeMobile,
  acceptRequest,
  declineRequest,
  t,
}: ISocialPanelContentProps) {
  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, searchQuery]);

  const content =
    activeTab === SocialTabId.Friends ? (
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2">
        {filteredFriends.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={UsersRound} size={SizeEnum.lg} color={AccentColorEnum.Muted} />}
            title={t.noFriendsTitle}
            description={t.noFriendsDescription}
          />
        ) : (
          <GList items={filteredFriends} keyExtractor={(f) => f.id} emptyMessage="" emptyDescription="" listClassName="gap-0.5">
            {(f) => (
              <SocialListItem
                firstName={f.firstName}
                lastName={f.lastName}
                userName={f.userName}
                status={f.status}
                onClick={() => goToChat(router, f.id, closeMobile)}
              />
            )}
          </GList>
        )}
      </div>
    ) : (
      (() => {
        const hasItems = gameInvites.length > 0 || requests.length > 0 || notifications.length > 0;

        if (!hasItems)
          return (
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2">
              <GEmpty
                icon={<GIcon icon={Bell} size={SizeEnum.lg} color={AccentColorEnum.Muted} />}
                title={t.noNotificationsTitle}
                description={t.noNotificationsDescription}
              />
            </div>
          );

        return (
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2 space-y-3">
            {gameInvites.length > 0 && <GameInvitesList />}

            {requests.length > 0 && (
              <GList items={requests} keyExtractor={(req) => req.senderId} emptyMessage="" emptyDescription="" listClassName="gap-0.5">
                {(req) => (
                  <div className="flex items-center gap-3 px-3 py-2 min-w-0 rounded-lg bg-bg-card border border-border">
                    <div className="relative shrink-0">
                      <GAvatar firstName={req.senderFirstName} lastName={req.senderLastName} size={SizeEnum.sm} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {req.senderFirstName} {req.senderLastName}
                      </p>
                      <p className="truncate text-xs text-text-muted">{t.sentYouRequest}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <GButton size={SizeEnum.sm} onClick={() => acceptRequest(req.senderId)}>
                        {t.invites.accept}
                      </GButton>
                      <GButton size={SizeEnum.sm} variant={ButtonVariantEnum.Secondary} onClick={() => declineRequest(req.senderId)}>
                        {t.invites.decline}
                      </GButton>
                    </div>
                  </div>
                )}
              </GList>
            )}

            {notifications.length > 0 && (
              <GList items={notifications} keyExtractor={(n) => n.id} emptyMessage="" emptyDescription="" listClassName="gap-0.5">
                {(n) => (
                  <div className="flex items-start gap-3 w-full px-3 py-2 min-w-0 rounded-lg text-start hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                    <GIcon icon={Bell} size={SizeEnum.sm} color={AccentColorEnum.Primary} className="mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{n.title}</p>
                      <p className="truncate text-xs text-text-muted">{n.body}</p>
                    </div>
                  </div>
                )}
              </GList>
            )}
          </div>
        );
      })()
    );

  return (
    <GAsync loading={loading} className="flex-1">
      {content}
    </GAsync>
  );
}

export { SocialPanelContent };
