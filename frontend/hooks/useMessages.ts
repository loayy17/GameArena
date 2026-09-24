"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import { chatService } from "@/services/def/ChatService";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { ar as messagesAr } from "@/app/(dashboard)/messages/i18n/ar.i18n";
import { fr as messagesFr } from "@/app/(dashboard)/messages/i18n/fr.i18n";
import { en as messagesEn } from "@/app/(dashboard)/messages/i18n/en.i18n";

import { useTranslation } from "./useSetting";

import type { TMessagesTranslation } from "@/app/(dashboard)/messages/i18n/en.i18n";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

const normalizeHistoryMessage = (message: IMessage): IMessage => ({
  ...message,
  sentAt: new Date(message.sentAt),
});

export function useMessages(initialFriendId?: TNullable<string>) {
  const { isSocialConnected: isConnected } = useConnections();
  const { user } = useAuth();
  const t = useTranslation<TMessagesTranslation>({ en: messagesEn, ar: messagesAr, fr: messagesFr });
  const { friends, loading: friendsLoading } = useDashboardData();
  const [selectedFriendId, setSelectedFriendId] = useState<TNullable<string>>(initialFriendId ?? null);
  const [reloadKey, setReloadKey] = useState(0);
  const prevInitialRef = useRef(initialFriendId);
  const loadGenRef = useRef(0);
  const controllerRef = useRef<TNullable<AbortController>>(null);

  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);
  const [apiMessages, setApiMessages] = useState<IMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<TNullable<string>>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<TNullable<string>>(null);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    const offTyping = chatService.onTyping((data) => {
      if (!selectedFriendId || data.senderId !== selectedFriendId) return;
      setTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 2500);
    });

    return () => {
      offTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedFriendId]);

  const notifyTyping = useCallback(() => {
    if (!selectedFriendId || !isConnected) return;
    const now = Date.now();
    if (now - lastTypingSentRef.current < 2000) return;
    lastTypingSentRef.current = now;
    void chatService.sendTyping(selectedFriendId).catch(() => {});
  }, [selectedFriendId, isConnected]);

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
  }, [selectedFriendId, reloadKey, t]);

  const messages = useMemo(() => {
    const combined = [...apiMessages, ...localMessages];
    const byId = new Map<string, IMessage>();
    for (const m of combined) {
      if (m.id) byId.set(m.id, m);
    }
    return [...byId.values()].sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
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

      setLocalMessages((prev) => (prev.some((m) => m.id && incoming.id && m.id === incoming.id) ? prev : [...prev, incoming]));
    });

    return off;
  }, [selectedFriendId]);

  useEffect(() => {
    const off = chatService.onReadReceipt((data) => {
      setLocalMessages((prev) => prev.map((m) => (m.senderId === user?.id && m.receiverId === data.readerId ? { ...m, isRead: true } : m)));
      setApiMessages((prev) => prev.map((m) => (m.senderId === user?.id && m.receiverId === data.readerId ? { ...m, isRead: true } : m)));
    });

    return off;
  }, [user?.id]);

  const selectFriend = useCallback((friendId: TNullable<string>) => {
    controllerRef.current?.abort();
    loadGenRef.current++;
    setSelectedFriendId(friendId);
    setLocalMessages([]);
    setDraft("");
    if (!friendId) {
      setApiMessages([]);
      setLoadingMessages(false);
      setError(null);
    }
    setSendError(null);
  }, []);

  useEffect(() => {
    const next = initialFriendId ?? null;
    if (next === prevInitialRef.current) return;
    prevInitialRef.current = next;
    selectFriend(next);
  }, [initialFriendId, selectFriend]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();
    if (!selectedFriendId || !content || !user) return;

    setSending(true);
    setSendError(null);

    setDraft("");

    try {
      await chatService.sendMessage(selectedFriendId, content);
    } catch {
      setSendError(t.error.send);
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
    typing,
    notifyTyping,
    selectFriend,
    sendMessage,
    reload,
  };
}
