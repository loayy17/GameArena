"use client";

import { useMemo, useState } from "react";
import { Bell, Check, MessageSquare, UsersRound, X } from "lucide-react";

import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { GAlert } from "@/component/common/GAlert";
import { GEmpty } from "@/component/common/GEmpty";
import { GButton } from "@/component/common/GButton";
import { GList } from "@/component/common/GList";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";
import { notificationTypeIcon } from "@/domain/constant/notificationIcons";
import { filterUsersByTerm } from "@/domain/lib/userUtils";
import { GUserRow } from "@/component/user/GUserRow";

import { SocialTabId } from "./SocialTabs";
import { GameInvitesList } from "./GameInvitesList";

import type { ISocialPanelContentProps } from "./def/SocialPanelContent";

function goToChat(router: ISocialPanelContentProps["router"], friendId: string, closeMobile: () => void) {
  router.push(`/messages?friend=${friendId}`);
  closeMobile();
}

function goToProfile(router: ISocialPanelContentProps["router"], friendId: string, closeMobile: () => void) {
  router.push(`/profile/${friendId}`);
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
  const filteredFriends = useMemo(() => filterUsersByTerm(friends, searchQuery), [friends, searchQuery]);

  const [requestError, setRequestError] = useState(false);

  const runRequestAction = async (action: () => Promise<void>) => {
    setRequestError(false);
    try {
      await action();
    } catch {
      setRequestError(true);
    }
  };

  const renderAlerts = () => {
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
          <>
            {requestError && <GAlert severity={AccentColorEnum.Danger}>{t.actionFailed}</GAlert>}
            <GList items={requests} keyExtractor={(req) => req.senderId} emptyMessage="" emptyDescription="" listClassName="gap-0.5">
              {(req) => (
                <GUserRow
                  user={{
                    id: req.senderId,
                    firstName: req.senderFirstName,
                    lastName: req.senderLastName,
                    fullName: req.senderFullName,
                    userName: req.senderUserName,
                  }}
                  href={`/profile/${req.senderId}`}
                  userNameFallback={t.sentYouRequest}
                  className="rounded-lg border border-border bg-bg-card px-3 py-2"
                  trailing={
                    <>
                      <GButton
                        type="button"
                        icon={Check}
                        label={t.invites.accept}
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Primary}
                        onClick={() => void runRequestAction(() => acceptRequest(req.senderId))}
                      />

                      <GButton
                        type="button"
                        icon={X}
                        label={t.invites.decline}
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Secondary}
                        onClick={() => void runRequestAction(() => declineRequest(req.senderId))}
                      />
                    </>
                  }
                />
              )}
            </GList>
          </>
        )}

        {notifications.length > 0 && (
          <GList items={notifications} keyExtractor={(n) => n.id} emptyMessage="" emptyDescription="" listClassName="gap-0.5">
            {(n) => {
              const ActionIcon = notificationTypeIcon[n.type] ?? Bell;
              const handleClick = () => {
                if (n.type === NotificationTypeEnum.NewMessage && n.referenceId) {
                  goToChat(router, n.referenceId, closeMobile);
                } else {
                  router.push("/notifications");
                  closeMobile();
                }
              };
              return (
                <GButton
                  type="button"
                  variant={ButtonVariantEnum.Subtle}
                  size={SizeEnum.None}
                  onClick={handleClick}
                  aria-label={n.title}
                  className="w-full gap-3 rounded-none p-0 px-3 py-2 text-start font-normal hover:bg-primary-muted justify-start">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-muted">
                    <GIcon icon={ActionIcon} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{n.title}</p>
                    <p className="truncate text-xs font-normal text-text-muted">{n.body}</p>
                  </div>
                </GButton>
              );
            }}
          </GList>
        )}
      </div>
    );
  };

  const content = activeTab === SocialTabId.Friends ? (
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
            <GUserRow
              user={f}
              onClick={() => goToProfile(router, f.id, closeMobile)}
              trailing={<GButton icon={MessageSquare} label={t.message} onClick={() => goToChat(router, f.id, closeMobile)} size={SizeEnum.sm} />}
              className="rounded-none px-3 py-2"
            />
          )}
        </GList>
      )}
    </div>
  ) : (
    renderAlerts()
  );

  return (
    <GAsync loading={loading} className="flex-1">
      {content}
    </GAsync>
  );
}

export { SocialPanelContent };