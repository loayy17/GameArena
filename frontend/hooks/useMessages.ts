"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { chatService } from "@/services/def/ChatService";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";
import { useTranslation } from "./useSetting";
import { ar as messagesAr } from "@/app/(dashboard)/messages/i18n/ar.i18n";
import { fr as messagesFr } from "@/app/(dashboard)/messages/i18n/fr.i18n";
import { en as messagesEn, type TMessagesTranslation } from "@/app/(dashboard)/messages/i18n/en.i18n";

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
  const { isSocialConnected: isConnected } = useConnections();
  const { user } = useAuth();
  const t = useTranslation({ en: messagesEn, ar: messagesAr, fr: messagesFr }) as TMessagesTranslation;
  const { friends, loading: friendsLoading } = useDashboardData();
  const [selectedFriendId, setSelectedFriendId] = useState<TNullable<string>>(initialFriendId ?? null);
  const prevInitialRef = useRef(initialFriendId);
  const loadGenRef = useRef(0);
  const controllerRef = useRef<TNullable<AbortController>>(null);

  useEffect(() => {
    if (initialFriendId && initialFriendId !== prevInitialRef.current) {
      prevInitialRef.current = initialFriendId;
      setSelectedFriendId(initialFriendId);
    }
  }, [initialFriendId]);

  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);
  const [apiMessages, setApiMessages] = useState<IMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<TNullable<string>>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<TNullable<string>>(null);

  useEffect(() => {
    controllerRef.current?.abort();
    const gen = ++loadGenRef.current;

    if (!selectedFriendId) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const timer = setTimeout(() => {
      setLoadingMessages(true);
      setError(null);

      chatService
        .getMessagesByFriendId(selectedFriendId, controller.signal)
        .then((res) => {
          if (loadGenRef.current === gen) setApiMessages((res.data ?? []).map(normalizeHistoryMessage));
        })
        .catch((err) => {
          if (loadGenRef.current !== gen || axios.isCancel(err)) return;
          setError(t.error.title);
        })
        .finally(() => {
          if (loadGenRef.current === gen) setLoadingMessages(false);
        });
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedFriendId, t]);

  const messages = useMemo(() => {
    const combined = [...apiMessages, ...localMessages];
    return combined.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [apiMessages, localMessages]);

  const selectedFriend = useMemo<TNullable<IUserSummary>>(() => {
    if (!selectedFriendId) return null;
    return friends.find((f) => f.id === selectedFriendId) ?? null;
  }, [friends, selectedFriendId]);

  useEffect(() => {
    const off = chatService.onPrivateMessage((incoming) => {
      if (!selectedFriendId) return;

      const isCurrentConversation = incoming.senderId === selectedFriendId || incoming.receiverId === selectedFriendId;

      if (!isCurrentConversation) return;

      setLocalMessages((prev) => (prev.some((m) => areSameMessage(m, incoming)) ? prev : [...prev, incoming]));
    });

    return off;
  }, [selectedFriendId]);

  const selectFriend = useCallback((friendId: TNullable<string>) => {
    controllerRef.current?.abort();
    loadGenRef.current++;
    setSelectedFriendId(friendId);
    setLocalMessages([]);
    if (!friendId) {
      setApiMessages([]);
      setLoadingMessages(false);
      setError(null);
    }
    setSendError(null);
  }, []);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();
    if (!selectedFriendId || !content || !user) return;

    setSending(true);
    setSendError(null);

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
      setSendError(t.error.send);
      setLocalMessages((prev) => prev.filter((m) => m !== outgoing));
    } finally {
      setSending(false);
    }
  }, [draft, selectedFriendId, user, t]);

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
    sending,
    sendError,
    selectFriend,
    sendMessage,
  };
}
