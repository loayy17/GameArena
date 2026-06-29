"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IUser } from "@/domain/meta/IUser";
import { chatService } from "@/services/def/ChatService";
import { useFriends } from "./useFriends";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";

type TPrivateMessagePayload = {
  senderId: string;
  receiverId: string;
  content?: string | null;
  message?: string | null;
  sentAt: string | Date;
  isRead?: boolean;
};

const normalizeMessage = (payload: TPrivateMessagePayload): IMessage => ({
  senderId: payload.senderId,
  receiverId: payload.receiverId,
  content: payload.content ?? payload.message ?? "",
  sentAt: new Date(payload.sentAt),
  isRead: payload.isRead ?? false,
});

const normalizeHistoryMessage = (message: IMessage): IMessage => ({
  ...message,
  sentAt: new Date(message.sentAt),
});

const areSameMessage = (left: IMessage, right: IMessage): boolean =>
  left.senderId === right.senderId &&
  left.receiverId === right.receiverId &&
  left.content === right.content &&
  left.sentAt.getTime() === right.sentAt.getTime();

export function useMessages(initialFriendId?: string | null) {
  const { chatConnection: connection, isChatConnected: isConnected } =
    useConnections();
  const { friends, loading: friendsLoading } = useFriends();
  const { refreshUnreadMessages } = useDashboardNotifications();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(
    initialFriendId ?? null,
  );
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFriend = useMemo<IUser | null>(() => {
    if (!selectedFriendId) return null;
    return friends.find((f) => f.id === selectedFriendId) ?? null;
  }, [friends, selectedFriendId]);

  useEffect(() => {
    if (!selectedFriendId) return;

    let alive = true;

    const loadMessages = async () => {
      setLoadingMessages(true);
      setError(null);

      try {
        const response =
          await chatService.getMessagesByFriendId(selectedFriendId);
        if (!alive) return;
        setMessages((response.data ?? []).map(normalizeHistoryMessage));
        await refreshUnreadMessages();
      } catch (err) {
        if (!alive) return;
        console.error("Failed to load messages", err);
        setMessages([]);
        setError("Failed to load messages. Please try again.");
      } finally {
        if (alive) setLoadingMessages(false);
      }
    };

    void loadMessages();

    return () => {
      alive = false;
    };
  }, [refreshUnreadMessages, selectedFriendId]);

  useEffect(() => {
    if (!connection) return;

    const handlePrivateMessage = (payload: TPrivateMessagePayload) => {
      if (!selectedFriendId) return;

      const incoming = normalizeMessage(payload);
      const isCurrentConversation =
        incoming.senderId === selectedFriendId ||
        incoming.receiverId === selectedFriendId;

      if (!isCurrentConversation) return;

      setMessages((prev) =>
        prev.some((m) => areSameMessage(m, incoming))
          ? prev
          : [...prev, incoming],
      );
    };

    connection.on("chat:private", handlePrivateMessage);

    return () => {
      connection.off("chat:private", handlePrivateMessage);
    };
  }, [connection, selectedFriendId]);

  const selectFriend = useCallback((friendId: string) => {
    setSelectedFriendId(friendId);
  }, []);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();

    if (!connection || !selectedFriendId || !content) return;

    try {
      await connection.invoke("SendPrivateMessage", selectedFriendId, content);
      setDraft("");
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message. Please try again.");
    }
  }, [connection, draft, selectedFriendId]);

  return {
    connection,
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
    selectFriend,
    setSelectedFriendId,
    sendMessage,
  };
}
