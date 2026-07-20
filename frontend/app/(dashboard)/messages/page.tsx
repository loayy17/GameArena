"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCheck, Send, WifiOff, MessagesSquare, ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { useMessages } from "@/hooks/useMessages";
import { GEmpty } from "@/component/common/GEmpty";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { ar } from "./i18n/ar.i18n";
import { en, type TMessagesTranslation } from "./i18n/en.i18n";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GTextField } from "@/component/common/GTextField";
import clsx from "clsx";
import { GAvatar } from "@/component/common/GAvatar";
import { chatService } from "@/services/def/ChatService";

const formatStatus = (status: UserStatusEnum, t: TMessagesTranslation) => {
  switch (status) {
    case UserStatusEnum.Online:
      return t.online;
    case UserStatusEnum.InGame:
      return t.playing;
    default:
      return t.offline;
  }
};

function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFriendId = searchParams.get("friend");
  const t = useTranslation({ en, ar }) as TMessagesTranslation;
  const [query, setQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    chatService.getPerFriendUnreadCounts().then((res) => {
      if (res.data) {
        const map: Record<string, number> = {};
        res.data.forEach((item) => { map[item.friendId] = item.unreadCount; });
        setUnreadCounts(map);
      }
    }).catch(() => {});
  }, []);

  const {
    friends,
    friendsLoading,
    selectedFriend,
    selectedFriendId,
    messages,
    draft,
    setDraft,
    loadingMessages,
    error,
    selectFriend,
    isConnected,
    sendMessage,
  } = useMessages(initialFriendId);

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((friend) => {
      const username = friend.userName?.toLowerCase() ?? "";
      return friend.fullName?.includes(term) || username.includes(term);
    });
  }, [friends, query]);

  const handleBack = () => {
    selectFriend(null);
    router.replace("/messages");
  };

  const showList = !selectedFriendId;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className={clsx("w-full sm:w-80 shrink-0 border-e border-border bg-bg-sidebar flex-col z-20", showList ? "flex" : "hidden sm:flex")}>
        <div className="p-4 border-b border-border space-y-4">
          <header className="flex items-center gap-3">
            <GIcon icon={MessagesSquare} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-text tracking-tight leading-tight">{t.title}</h1>
                <div className="mb-1">
                  <GBadge variant={isConnected ? "success" : "danger"} className="shrink-0">
                    {!isConnected && <GIcon icon={WifiOff} size="xs" color="inherit" />}
                    {isConnected ? t.connected : t.disconnected}
                  </GBadge>
                </div>
              </div>
              <p className="text-sm text-text-muted mt-0.5">{t.subtitle}</p>
            </div>
          </header>
          <GTextField
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            startIcon={<GIcon icon={Search} size="sm" color="muted" />}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {friendsLoading ? (
            <div className="flex justify-center py-10">
              <GSpinner />
            </div>
          ) : filteredFriends.length === 0 ? (
            <GEmpty icon={<GIcon icon={MessagesSquare} size="xl" color="muted" />} title={t.noFriendsTitle} description={t.noFriendsDescription} />
          ) : (
            <FriendsList friends={filteredFriends} messageLabel={t.message} activeLabel={t.active} query={query} unreadCounts={unreadCounts} />
          )}
        </div>
      </aside>

      <section className={clsx("min-w-0 flex-1 flex-col bg-bg", showList ? "hidden sm:flex" : "flex")}>
        {selectedFriend ? (
          <>
            <header className="flex items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 py-4 shrink-0">
              <GButton variant="ghost" size="icon" onClick={handleBack} className="sm:hidden" aria-label={t.back}>
                <GIcon icon={ArrowLeft} size="md" color="secondary" />
              </GButton>
              <div className="relative shrink-0">
                <GAvatar
                  firstName={selectedFriend.firstName}
                  lastName={selectedFriend.lastName}
                  status={selectedFriend.status}
                  size="sm"
                  shape="circle"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-text">{selectedFriend.fullName}</h2>
                <p className={clsx("text-xs font-medium", (selectedFriend.status ?? UserStatusEnum.Offline) === UserStatusEnum.InGame ? "text-primary" : "text-text-muted")}>
                  {formatStatus(selectedFriend.status ?? UserStatusEnum.Offline, t)}
                </p>
              </div>
              {!isConnected && <GBadge variant="danger">{t.disconnected}</GBadge>}
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <GSpinner size="lg" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <GEmpty
                    icon={<GIcon icon={MessagesSquare} size="xl" color="muted" />}
                    title={t.noMessagesTitle}
                    description={t.noMessagesDescription}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const outgoing = message.senderId !== selectedFriend.id;
                    const time = new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    return (
                      <div
                        key={`${message.senderId}-${message.sentAt.toISOString()}-${index}`}
                        className={clsx("flex", outgoing ? "justify-end" : "justify-start")}>
                        <div
                          className={clsx(
                            "max-w-[85%] sm:max-w-[70%] min-w-0 px-4 py-2.5 text-sm leading-relaxed wrap-anywhere break-words rounded-[var(--radius-lg)]",
                            outgoing
                              ? "ms-auto rounded-ee-sm bg-primary text-on-primary"
                              : "rounded-es-sm border border-border bg-surface text-text",
                          )}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div
                            className={clsx(
                              "mt-1.5 flex items-center gap-1.5 text-2xs font-medium",
                              outgoing ? "justify-end text-on-primary/80" : "text-text-muted",
                            )}>
                            <span>{time}</span>
                            {outgoing && (
                              <GIcon icon={CheckCheck} size="sm" color="inherit" className={message.isRead ? "opacity-100" : "opacity-50"} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="border-t border-border bg-surface px-4 sm:px-6 py-4 shrink-0 pb-safe mb-16 lg:mb-0">
              {error && (
                <GBadge variant="danger" className="mb-3">
                  {error}
                </GBadge>
              )}
              <div className="flex items-end gap-2">
                <GTextField
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="flex-1"
                />
                <GButton
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || !isConnected}
                  size="sm"
                  leftIcon={<GIcon icon={Send} size="sm" color="inherit" className="text-on-primary" />}>
                  <span className="hidden sm:inline">{t.send}</span>
                </GButton>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <GEmpty
              icon={<GIcon icon={MessagesSquare} size="lg" tile tileSize="lg" tileGradient="bg-primary/10" tileColor="primary" />}
              title={t.selectConversationTitle}
              description={t.selectConversationDescription}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default MessagesPage;
