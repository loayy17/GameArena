"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCheck,
  Send,
  WifiOff,
  MessagesSquare,
  Gamepad2,
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

const displayName = (user: {
  fullName?: string | null;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
}, fallback: string) =>
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
  }, [friends, query]);

  const handleSelectFriend = (friendId: string) => {
    selectFriend(friendId);
    router.replace(`/messages?friend=${friendId}`);
  };

  const handleBack = () => {
    selectFriend(null);
    router.replace("/messages");
  };

  // On phones we show either the conversation list OR the open chat, never both.
  const showList = !selectedFriendId;

  return (
    <div className="flex h-full min-h-0 relative overflow-hidden">
      {/* Conversations list */}
      <aside
        className={`w-full sm:w-80 shrink-0 border-r border-border/50 bg-bg-sidebar flex-col z-20 ${
          showList ? "flex" : "hidden sm:flex"
        }`}
      >
        <div className="p-4 border-b border-border/50 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-text tracking-wide">
                {t.title}
              </h1>
              <p className="text-xs text-text-muted">{t.subtitle}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                isConnected
                  ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                  : "bg-error-bg text-error border-error/20"
              }`}
            >
              {isConnected ? (
                <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {isConnected ? t.connected : t.disconnected}
            </span>
          </div>

          <GInputSearch
            value={query}
            onChange={setQuery}
            placeholder={t.search}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {friendsLoading ? (
            <div className="flex justify-center py-10">
              <GSpinner />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="py-10 opacity-70">
              <GEmpty
                icon={<MessagesSquare className="h-10 w-10 text-text-muted" />}
                title={t.noFriendsTitle}
                description={t.noFriendsDescription}
              />
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => {
                const active = friend.id === selectedFriendId;
                return (
                  <button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend.id)}
                    className={`nav-link w-full ${active ? "active" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <GTile user={friend} size="sm" />
                      <GStatusDot status={friend.status} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-bold">
                        {displayName(friend, t.unknownUser)}
                      </p>
                      <p className="truncate text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        {friend.status === UserStatusEnum.InGame && (
                          <Gamepad2 className="w-3 h-3 text-primary" />
                        )}
                        {friend.userName ? `@${friend.userName}` : t.noUsername}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Chat area */}
      <section
        className={`min-w-0 flex-1 flex-col relative bg-bg-card/30 ${showList ? "hidden sm:flex" : "flex"}`}
      >
        {selectedFriend ? (
          <>
            <header className="flex items-center gap-3 border-b border-border/50 bg-surface-alt/40 px-4 sm:px-6 py-4 shrink-0">
              <button
                onClick={handleBack}
                className="sm:hidden p-1.5 -ml-1 text-text-secondary hover:text-text rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative shrink-0">
                <GTile user={selectedFriend} size="md" />
                <GStatusDot status={selectedFriend.status} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-text">
                  {displayName(selectedFriend, t.unknownUser)}
                </h2>
                <p
                  className={`text-xs font-medium ${selectedFriend.status === UserStatusEnum.InGame ? "text-primary" : "text-text-muted"}`}
                >
                  {formatStatus(selectedFriend.status, t)}
                </p>
              </div>
              {!isConnected && (
                <span className="rounded-lg bg-error-bg px-3 py-1.5 text-xs font-bold text-error border border-error/20">
                  {t.disconnected}
                </span>
              )}
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <GSpinner size="lg" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center opacity-60">
                  <GEmpty
                    icon={
                      <MessagesSquare className="h-12 w-12 text-text-muted mb-4" />
                    }
                    title={t.noMessagesTitle}
                    description={t.noMessagesDescription}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => {
                    const outgoing = message.senderId !== selectedFriend.id;
                    const time = new Date(message.sentAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    );

                    return (
                      <div
                        key={`${message.senderId}-${message.sentAt.toISOString()}-${index}`}
                        className={`flex ${outgoing ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`msg-bubble ${outgoing ? "out" : "in"}`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-anywhere">
                            {message.content}
                          </p>
                          <div
                            className={`mt-1.5 flex items-center gap-1.5 text-[10px] font-medium ${outgoing ? "justify-end text-white/70" : "text-text-muted"}`}
                          >
                            <span>{time}</span>
                            {outgoing && (
                              <CheckCheck
                                className={`h-3.5 w-3.5 ${message.isRead ? "text-white" : "text-white/40"}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="border-t border-border/50 bg-surface-alt/40 px-4 sm:px-6 py-4 shrink-0 pb-safe">
              {error && (
                <p className="mb-3 text-xs font-bold text-error bg-error-bg inline-block px-3 py-1 rounded-lg border border-error/20">
                  {error}
                </p>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-2 py-2 focus-within:border-primary transition-colors">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-text-muted h-10"
                />
                <GButton
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || !isConnected}
                  size="sm"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  <span className="hidden sm:inline">{t.send}</span>
                </GButton>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md text-center opacity-70">
              <div className="icon-tile w-20 h-20 bg-surface-alt mx-auto mb-6 border border-border/50 rotate-3">
                <MessagesSquare className="h-10 w-10 text-primary -rotate-3" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t.selectConversationTitle}
              </h3>
              <p className="text-sm text-text-muted">
                {t.selectConversationDescription}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default MessagesPage;
