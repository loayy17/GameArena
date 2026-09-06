"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessagesSquare, WifiOff } from "lucide-react";

import { useMessages } from "@/hooks/useMessages";
import { useTranslation } from "@/hooks/useSetting";
import { GBadge } from "@/component/common/GBadge";
import { GAside } from "@/component/common/GAside";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { chatService } from "@/services/def/ChatService";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { statusColorText } from "@/domain/constant/style-tokens";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { ConversationHeader } from "@/component/messages/ConversationHeader";
import { ComposerError, MessageComposer } from "@/component/messages/MessageComposer";
import { FriendList } from "@/component/messages/FriendList";
import { MessageList } from "@/component/messages/MessageList";
import { cn } from "@/lib/cn";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { TMessagesTranslation } from "./i18n/en.i18n";

const formatStatus = (status: UserStatusEnum, t: TMessagesTranslation) =>
  status === UserStatusEnum.Online ? t.online : status === UserStatusEnum.InGame ? t.playing : t.offline;

function MessagesPage() {
  const router = useRouter();
  const initialFriendId = useSearchParams().get("friend");
  const t = useTranslation<TMessagesTranslation>({ en, ar, fr });

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messageInputRef = useRef<HTMLInputElement>(null);

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
    typing,
    notifyTyping,
    selectFriend,
    sendMessage,
    reload,
  } = useMessages(initialFriendId);

  useEffect(() => {
    let alive = true;
    chatService
      .getPerFriendUnreadCounts()
      .then((res) => {
        if (!alive) return;
        const map: Record<string, number> = {};
        res.data?.forEach(({ friendId, unreadCount }) => {
          map[friendId] = unreadCount;
        });
        setUnreadCounts(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [selectedFriendId]);

  const handleSelect = (friendId: string) => router.push(`/messages?friend=${friendId}`);

  const handleBack = () => {
    selectFriend(null);
    router.replace("/messages");
  };

  const showList = !selectedFriendId;
  const composerError = sendError ?? error ?? undefined;

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <GAside label={t.title} className={cn("w-full border-border sm:w-80", showList ? "flex" : "hidden sm:flex")}>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <GIcon icon={MessagesSquare} variant="tile" size={SizeEnum.xl} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text sm:text-2xl">{t.title}</h1>
              {!isConnected && (
                <GBadge variant={AccentColorEnum.Danger} size={SizeEnum.xs}>
                  <GIcon icon={WifiOff} size={SizeEnum.xs} />
                  {t.disconnected}
                </GBadge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-text-muted">{t.subtitle}</p>
          </div>
        </div>

        <FriendList
          friends={friends}
          loading={friendsLoading}
          selectedFriendId={selectedFriendId ?? undefined}
          unreadCounts={unreadCounts}
          onSelect={handleSelect}
          t={{ search: t.search, noFriendsTitle: t.noFriendsTitle, noFriendsDescription: t.noFriendsDescription, message: t.message, viewProfile: t.viewProfile }}
        />
      </GAside>

      <section className={cn("min-w-0 flex-1 flex-col bg-bg", showList ? "hidden sm:flex" : "flex")}>
        {selectedFriendId ? (
          <>
            <ConversationHeader
              friend={selectedFriend}
              friendId={selectedFriendId}
              statusClass={statusColorText[selectedFriend?.status ?? UserStatusEnum.Offline]}
              statusLabel={selectedFriend ? formatStatus(selectedFriend.status ?? UserStatusEnum.Offline, t) : ""}
              isConnected={isConnected}
              disconnectedLabel={t.disconnected}
              backLabel={t.back}
              onBack={handleBack}
              inviteLabel={t.inviteToGame}
            />

            <MessageList
              messages={messages}
              selectedFriendId={selectedFriendId}
              loading={loadingMessages}
              typing={typing}
              error={error ?? undefined}
              errorTitle={t.error.title}
              emptyTitle={t.noMessagesTitle}
              emptyDescription={t.noMessagesDescription}
              retryLabel={t.error.retry}
              onRetry={reload}
            />

            <footer className="shrink-0 border-t border-border bg-surface px-4 py-4 pb-safe sm:px-6">
              {composerError && <ComposerError message={composerError} />}
              <MessageComposer
                inputRef={messageInputRef}
                value={draft}
                sendDisabled={!draft.trim() || !isConnected || sending}
                sending={sending}
                placeholder={t.placeholder}
                ariaLabel={t.placeholder}
                sendLabel={t.send}
                onChange={(value) => {
                  setDraft(value);
                  notifyTyping();
                }}
                onSend={() => void sendMessage()}
              />
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <GEmpty
              icon={<GIcon icon={MessagesSquare} variant="tile" size={SizeEnum.lg} tone="primary" />}
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
