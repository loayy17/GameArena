"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatService } from "@/services/def/ChatService";
import { useFriends } from "./useFriends";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";
import { useFetch } from "./useFetch";

const normalizeHistoryMessage = (message: IMessage): IMessage => ({
  ...message,
  sentAt: new Date(message.sentAt),
});

const areSameMessage = (left: IMessage, right: IMessage): boolean =>
  left.senderId === right.senderId &&
  left.receiverId === right.receiverId &&
  left.content === right.content &&
  Math.abs(left.sentAt.getTime() - right.sentAt.getTime()) < 5000;

export function useMessages(initialFriendId?: TNullable<string>) {
  const { isChatConnected: isConnected } = useConnections();
  const { user } = useAuth();
  const { friends, loading: friendsLoading } = useFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<TNullable<string>>(initialFriendId ?? null);
  const prevInitialRef = useRef(initialFriendId);

  useEffect(() => {
    if (initialFriendId && initialFriendId !== prevInitialRef.current) {
      prevInitialRef.current = initialFriendId;
      setSelectedFriendId(initialFriendId);
    }
  }, [initialFriendId]);

  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);

  const { data: apiMessages, loading: loadingMessages, error } = useFetch(() => {
    if (!selectedFriendId) return Promise.resolve([] as IMessage[]);
    return chatService
      .getMessagesByFriendId(selectedFriendId)
      .then((res) => (res.data ?? []).map(normalizeHistoryMessage));
  }, [selectedFriendId]);

  const baseMessages = useMemo(() => apiMessages ?? [], [apiMessages]);
  const messages = useMemo(() => [...baseMessages, ...localMessages], [baseMessages, localMessages]);

  const selectedFriend = useMemo<TNullable<IUserSummary>>(() => {
    if (!selectedFriendId) return null;
    return friends.find((f) => f.id === selectedFriendId) ?? null;
  }, [friends, selectedFriendId]);

  useEffect(() => {
    const off = chatService.onPrivateMessage((incoming) => {
      if (!selectedFriendId) return;

      const isCurrentConversation =
        incoming.senderId === selectedFriendId ||
        incoming.receiverId === selectedFriendId;

      if (!isCurrentConversation) return;

      setLocalMessages((prev) =>
        prev.some((m) => areSameMessage(m, incoming))
          ? prev
          : [...prev, incoming],
      );
    });

    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriendId]);

  const selectFriend = useCallback((friendId: TNullable<string>) => {
    setSelectedFriendId(friendId);
    setLocalMessages([]);
  }, []);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();
    if (!selectedFriendId || !content || !user) return;

    const outgoing: IMessage = {
      senderId: user.id,
      receiverId: selectedFriendId,
      content,
      sentAt: new Date(),
      isRead: false,
    };

    setLocalMessages((prev) => [...prev, outgoing]);
    setDraft("");

    try {
      await chatService.sendMessage(selectedFriendId, content);
    } catch {
      setLocalMessages((prev) => prev.filter((m) => m !== outgoing));
    }
  }, [draft, selectedFriendId, user]);

  return {
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
    sendMessage,
  };
}