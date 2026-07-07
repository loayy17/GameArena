"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCheck,
  Send,
  WifiOff,
  MessagesSquare,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { useMessages } from "@/hooks/useMessages";
import { GEmpty } from "@/component/common/GEmpty";
import { GTile } from "@/component/common/GTile";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { ar } from "./i18n/ar.i18n";
import { en, type TMessagesTranslation } from "./i18n/en.i18n";
import { GButton } from "@/component/common/GButton";
import { GInputSearch } from "@/component/common/GInputSearch";
import { GSpinner } from "@/component/common/GSpinner";
import { GStatusDot } from "@/component/common/GStatusDot";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GIconTile } from "@/component/common/GIconTile";
import { GMessageBubble } from "@/component/common/GMessageBubble";
import { GTextField } from "@/component/common/GTextField";
import clsx from "clsx";

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

const displayName = (
  user: {
    fullName?: string | null;
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
  },
  fallback: string,
) =>
  user.fullName ??
  ([user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.userName ||
    fallback);

function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFriendId = searchParams.get("friend");
  const t = useTranslation({ en, ar }) as TMessagesTranslation;
  const [query, setQuery] = useState("");

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
      const name = displayName(friend, t.unknownUser).toLowerCase();
      const username = friend.userName?.toLowerCase() ?? "";
      return name.includes(term) || username.includes(term);
    });
  }, [friends, query, t.unknownUser]);

  const handleSelectFriend = (friendId: string) => {
    selectFriend(friendId);
    router.replace(`/messages?friend=${friendId}`);
  };

  const handleBack = () => {
    selectFriend(null);
    router.replace("/messages");
  };

  const showList = !selectedFriendId;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside
        className={clsx(
          "w-full sm:w-80 shrink-0 border-e border-border bg-bg-sidebar flex-col z-20",
          showList ? "flex" : "hidden sm:flex",
        )}
      >
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-text">{t.title}</h1>
              <p className="text-xs text-text-muted">{t.subtitle}</p>
            </div>
            <GBadge variant={isConnected ? "success" : "danger"}>
              {!isConnected && <GIcon icon={WifiOff} size="xs" color="inherit" />}
              {isConnected ? t.connected : t.disconnected}
            </GBadge>
          </div>
          <GInputSearch value={query} onChange={setQuery} placeholder={t.search} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {friendsLoading ? (
            <div className="flex justify-center py-10">
              <GSpinner />
            </div>
          ) : filteredFriends.length === 0 ? (
            <GEmpty
              icon={<GIcon icon={MessagesSquare} size="xl" color="muted" />}
              title={t.noFriendsTitle}
              description={t.noFriendsDescription}
            />
          ) : (
            <FriendsList
              friends={filteredFriends}
              onSelectFriend={handleSelectFriend}
              activeId={selectedFriendId}
              indicator="start"
            />
          )}
        </div>
      </aside>

      <section
        className={clsx(
          "min-w-0 flex-1 flex-col bg-bg",
          showList ? "hidden sm:flex" : "flex",
        )}
      >
        {selectedFriend ? (
          <>
            <header className="flex items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 py-4 shrink-0">
              <GButton
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="sm:hidden"
                aria-label="Back"
              >
                <GIcon icon={ArrowLeft} size="md" color="secondary" />
              </GButton>
              <div className="relative shrink-0">
                <GTile user={selectedFriend} size="md" />
                <GStatusDot status={selectedFriend.status} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-text">
                  {displayName(selectedFriend, t.unknownUser)}
                </h2>
                <p
                  className={clsx(
                    "text-xs font-medium",
                    selectedFriend.status === UserStatusEnum.InGame
                      ? "text-primary"
                      : "text-text-muted",
                  )}
                >
                  {formatStatus(selectedFriend.status, t)}
                </p>
              </div>
              {!isConnected && (
                <GBadge variant="danger">{t.disconnected}</GBadge>
              )}
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
                    const time = new Date(message.sentAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    );

                    return (
                      <div
                        key={`${message.senderId}-${message.sentAt.toISOString()}-${index}`}
                        className={clsx("flex", outgoing ? "justify-end" : "justify-start")}
                      >
                        <GMessageBubble
                          outgoing={outgoing}
                          meta={
                            <div
                              className={clsx(
                                "mt-1.5 flex items-center gap-1.5 text-2xs font-medium",
                                outgoing ? "justify-end text-on-primary/80" : "text-text-muted",
                              )}
                            >
                              <span>{time}</span>
                              {outgoing && (
                                <CheckCheck
                                  className={clsx(
                                    "h-3.5 w-3.5",
                                    message.isRead ? "opacity-100" : "opacity-50",
                                  )}
                                />
                              )}
                            </div>
                          }
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </GMessageBubble>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="border-t border-border bg-surface px-4 sm:px-6 py-4 shrink-0 pb-safe">
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
                  className="flex-1"
                />
                <GButton
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || !isConnected}
                  size="sm"
                  leftIcon={<GIcon icon={Send} size="sm" color="inherit" className="text-on-primary" />}
                >
                  <span className="hidden sm:inline">{t.send}</span>
                </GButton>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <GEmpty
              icon={
                <GIconTile gradient="subtle-brand" size="lg">
                  <GIcon icon={MessagesSquare} size="lg" color="primary" />
                </GIconTile>
              }
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
