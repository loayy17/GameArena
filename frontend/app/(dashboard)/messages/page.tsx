"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCheck, Send, WifiOff, MessagesSquare, ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { useMessages } from "@/hooks/useMessages";
import { GEmpty } from "@/component/common/GEmpty";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { statusColorText } from "@/domain/constant/status-color";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TMessagesTranslation } from "./i18n/en.i18n";
import { GButton } from "@/component/common/GButton";
import { GAsync } from "@/component/common/GAsync";
import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GTextField } from "@/component/common/GTextField";
import clsx from "clsx";
import { chatService } from "@/services/def/ChatService";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

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
  const t = useTranslation({ en, ar, fr }) as TMessagesTranslation;
  const [query, setQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    chatService
      .getPerFriendUnreadCounts()
      .then((res) => {
        if (res.data) {
          const map: Record<string, number> = {};
          res.data.forEach((item) => {
            map[item.friendId] = item.unreadCount;
          });
          setUnreadCounts(map);
        }
      })
      .catch(() => {});
  }, []);

  const {
    isConnected,
    friends,
    friendsLoading,
    selectedFriend,
    selectedFriendId,
    messages,
    draft,
    setDraft,
    loadingMessages,
    error,
    sending,
    sendError,
    selectFriend,
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
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className={clsx("w-full sm:w-80 shrink-0 border-e border-border bg-bg-sidebar flex-col", showList ? "flex" : "hidden sm:flex")}>
        <div className="p-4 border-b border-border space-y-4">
          <header className="flex items-center gap-3">
            <GIcon icon={MessagesSquare} size={SizeEnum.xl} tile tileColor={AccentColorEnum.OnPrimary} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text">{t.title}</h1>
                <GBadge variant={isConnected ? AccentColorEnum.Success : AccentColorEnum.Danger} size={SizeEnum.xs}>
                  {!isConnected && <GIcon icon={WifiOff} size={SizeEnum.xs} />}
                </GBadge>
              </div>
              <p className="text-sm text-text-muted mt-0.5">{t.subtitle}</p>
            </div>
          </header>
          <GTextField
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <GAsync loading={friendsLoading} spinnerSize={SizeEnum.lg} className="py-10">
            {filteredFriends.length === 0 ? (
              <GEmpty
                icon={<GIcon icon={MessagesSquare} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
                title={t.noFriendsTitle}
                description={t.noFriendsDescription}
              />
            ) : (
              <div className="space-y-1">
                {filteredFriends.map((friend) => {
                  const isActive = friend.id === selectedFriendId;
                  return (
                    <div
                      key={friend.id}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        isActive ? "bg-primary-muted" : "hover:bg-bg-card-hover",
                      )}
                      onClick={() => {
                        if (!isActive) router.push(`/messages?friend=${friend.id}`);
                      }}
                      role={!isActive ? "button" : undefined}
                      tabIndex={!isActive ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (!isActive && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          router.push(`/messages?friend=${friend.id}`);
                        }
                      }}
                      aria-label={friend.fullName ?? friend.userName ?? friend.id}>
                      <GAvatar firstName={friend.firstName} lastName={friend.lastName} status={friend.status} size={SizeEnum.sm} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-text">{friend.fullName}</h3>
                        <p className="truncate text-xs text-text-secondary">@{friend.userName}</p>
                      </div>
                      {unreadCounts[friend.id] != null && unreadCounts[friend.id] > 0 && (
                        <GBadge variant={AccentColorEnum.Danger} size={SizeEnum.sm} className="shrink-0 min-w-5 justify-center">
                          {unreadCounts[friend.id]}
                        </GBadge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GAsync>
        </div>
      </aside>

      <section className={clsx("min-w-0 flex-1 flex-col bg-bg", showList ? "hidden sm:block" : "flex")}>
        {selectedFriendId ? (
          <>
            <header className="flex items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 py-4 shrink-0">
              <div className="sm:hidden">
                <GButton variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} onClick={handleBack} aria-label={t.back}>
                  <GIcon icon={ArrowLeft} size={SizeEnum.md} color={AccentColorEnum.Secondary} flip />
                </GButton>
              </div>
              <GAvatar
                firstName={selectedFriend?.firstName ?? ""}
                lastName={selectedFriend?.lastName ?? ""}
                status={selectedFriend?.status ?? UserStatusEnum.Offline}
                size={SizeEnum.sm}
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-text">{selectedFriend?.fullName ?? selectedFriendId}</h2>
                <p className={clsx("text-xs font-medium", statusColorText[selectedFriend?.status ?? UserStatusEnum.Offline])}>
                  {selectedFriend ? formatStatus(selectedFriend.status ?? UserStatusEnum.Offline, t) : ""}
                </p>
              </div>
              {!isConnected && <span className="text-xs text-danger">{t.disconnected}</span>}
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
              <GAsync loading={loadingMessages} error={error} spinnerSize={SizeEnum.lg} errorTitle={t.error.title} className="h-full">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <GEmpty
                      icon={<GIcon icon={MessagesSquare} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
                      title={t.noMessagesTitle}
                      description={t.noMessagesDescription}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const outgoing = message.senderId !== selectedFriendId;
                      const time = new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                      return (
                        <div
                          key={`${message.senderId}-${message.sentAt.toISOString()}-${index}`}
                          className={clsx("flex", outgoing ? "justify-end" : "justify-start")}>
                          <div
                            className={clsx(
                              "max-w-message-mobile sm:max-w-message-tablet min-w-0 px-4 py-2.5 text-sm leading-relaxed wrap-anywhere rounded-lg",
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
                              {outgoing && <GIcon icon={CheckCheck} size={SizeEnum.sm} className={message.isRead ? "opacity-100" : "opacity-50"} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GAsync>
            </div>

            <footer className="border-t border-border bg-surface px-4 sm:px-6 py-4 shrink-0 pb-safe">
              {error && (
                <GBadge variant={AccentColorEnum.Danger} className="mb-3">
                  {error}
                </GBadge>
              )}
              {sendError && (
                <GBadge variant={AccentColorEnum.Danger} className="mb-3">
                  {sendError}
                </GBadge>
              )}
              <div className="flex gap-2 items-center">
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
                  disabled={sending}
                />
                <GButton
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || !isConnected || sending}
                  loading={sending}
                  loadingText={t.send}
                  size={SizeEnum.md}
                  startIcon={<GIcon icon={Send} size={SizeEnum.sm} color={AccentColorEnum.OnPrimary} />}>
                  <span className="hidden sm:inline">{t.send}</span>
                </GButton>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <GEmpty
              icon={<GIcon icon={MessagesSquare} size={SizeEnum.lg} tile tileGradient="bg-primary/10" tileColor={AccentColorEnum.Primary} />}
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
