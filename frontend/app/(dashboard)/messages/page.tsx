"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCheck,
  Loader2,
  Search,
  Send,
  WifiOff,
  MessagesSquare,
} from "lucide-react";
import { useTranslation } from "@/Hooks/useTranslation";
import { useMessages } from "@/Hooks/useMessages";
import { EmptyState } from "@/component/common/TEmpty";
import { TTile } from "@/component/common/TTile";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { ar } from "./i18n/ar.i18n";
import { en, type TMessagesTranslation } from "./i18n/en.i18n";

const statusClass: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Online]: "bg-emerald-500",
  [UserStatusEnum.Offline]: "bg-slate-500",
  [UserStatusEnum.InGame]: "bg-cyan-500",
  [UserStatusEnum.All]: "bg-slate-500",
};

const formatStatus = (status: UserStatusEnum, t: TMessagesTranslation) => {
  switch (status) {
    case UserStatusEnum.Online:
      return t.online;
    case UserStatusEnum.InGame:
      return t.playing;
    case UserStatusEnum.Offline:
    default:
      return t.offline;
  }
};

const displayName = (user: {
  fullName?: string | null;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
}) =>
  user.fullName ??
  ([user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.userName ||
    "Unknown user");

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
      const name = displayName(friend).toLowerCase();
      const username = friend.userName?.toLowerCase() ?? "";
      return name.includes(term) || username.includes(term);
    });
  }, [friends, query]);

  const handleSelectFriend = (friendId: string) => {
    selectFriend(friendId);
    router.replace(`/messages?friend=${friendId}`);
  };

  return (
    <div className="flex h-full min-h-0 relative z-10 overflow-hidden bg-linear-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <aside className="w-80 shrink-0 border-r border-border/70 bg-bg-dark/50 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/70 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">{t.title}</h1>
              <p className="text-xs text-text-muted">{t.subtitle}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
                isConnected
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {isConnected ? (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {isConnected ? t.connected : t.disconnected}
            </span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-xl border border-border bg-bg-card/90 py-3 pl-9 pr-3 text-sm text-white outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {friendsLoading ? (
            <div className="flex items-center justify-center py-10 text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <EmptyState
              icon={<MessagesSquare className="h-10 w-10" />}
              title={t.noFriendsTitle}
              description={t.noFriendsDescription}
            />
          ) : (
            <div className="space-y-2">
              {filteredFriends.map((friend) => {
                const active = friend.id === selectedFriendId;

                return (
                  <button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-primary/60 bg-primary/10"
                        : "border-transparent bg-bg-card/50 hover:border-border hover:bg-bg-card/80"
                    }`}
                  >
                    <TTile user={friend} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {displayName(friend)}
                        </p>
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusClass[friend.status]}`}
                        />
                      </div>
                      <p className="truncate text-xs text-text-muted">
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

      <section className="flex min-w-0 flex-1 flex-col">
        {selectedFriend ? (
          <>
            <header className="flex items-center gap-3 border-b border-border/70 bg-bg-dark/40 px-4 py-4 backdrop-blur-xl">
              <TTile user={selectedFriend} size="sm" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-white">
                  {displayName(selectedFriend)}
                </h2>
                <p className="text-xs text-text-muted">
                  {formatStatus(selectedFriend.status, t)}
                </p>
              </div>
              {!isConnected && (
                <span className="rounded-full bg-rose-500/15 px-3 py-1 text-[11px] text-rose-300">
                  {t.disconnected}
                </span>
              )}
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center text-text-muted">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <EmptyState
                  icon={<MessagesSquare className="h-10 w-10" />}
                  title={t.noMessagesTitle}
                  description={t.noMessagesDescription}
                />
              ) : (
                <div className="space-y-3">
                  {messages.map((message, index) => {
                    const outgoing = message.senderId !== selectedFriend.id;
                    const time = new Date(message.sentAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    return (
                      <div
                        key={`${message.senderId}-${message.sentAt.toISOString()}-${index}`}
                        className={`flex ${
                          outgoing ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                            outgoing
                              ? "rounded-br-md bg-primary text-white"
                              : "rounded-bl-md border border-border bg-bg-card text-text"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {message.content}
                          </p>
                          <div
                            className={`mt-2 flex items-center gap-2 text-[10px] ${
                              outgoing
                                ? "justify-end text-white/70"
                                : "text-text-muted"
                            }`}
                          >
                            <span>{time}</span>
                            {outgoing && (
                              <CheckCheck
                                className={`h-3.5 w-3.5 ${
                                  message.isRead
                                    ? "text-cyan-300"
                                    : "text-white/40"
                                }`}
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

            <footer className="border-t border-border/70 bg-bg-dark/50 px-4 py-4 backdrop-blur-xl">
              {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card px-4 py-3">
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
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || !isConnected}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {t.send}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={<MessagesSquare className="h-10 w-10" />}
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
