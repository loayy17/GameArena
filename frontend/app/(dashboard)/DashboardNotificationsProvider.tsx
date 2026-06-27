"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import { useConnection } from "@/Hooks/useConnection";
import { chatService } from "@/services/def/ChatService";
import { friendService } from "@/services/def/FriendService";
import type {
  IGameInvite,
  INotificationState,
} from "@/domain/meta/INotification";
import type {
  TChatNotificationPayload,
  TFriendRequestPayload,
  TGameInvitePayload,
} from "@/types";

const NotificationContext = createContext<INotificationState | undefined>(
  undefined,
);

export function DashboardNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { connection: chatConnection } = useConnection("chatHub");
  const { connection: gameConnection } = useConnection("gameHub");

  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);

  const syncFriendRequests = useCallback(async () => {
    try {
      const response = await friendService.getReceivedFriendRequests();
      setFriendRequestCount(response.data?.length ?? 0);
    } catch (error) {
      console.error("Failed to sync friend requests", error);
    }
  }, []);

  const syncUnreadMessages = useCallback(async () => {
    try {
      const response = await chatService.getUnreadMessageCount();
      setUnreadMessageCount(response.data ?? 0);
    } catch (error) {
      console.error("Failed to sync unread messages", error);
    }
  }, []);

  const syncCounts = useCallback(async () => {
    await Promise.all([syncFriendRequests(), syncUnreadMessages()]);
  }, [syncFriendRequests, syncUnreadMessages]);

  useEffect(() => {
    if (!user) {
      setFriendRequestCount(0);
      setUnreadMessageCount(0);
      setGameInvites([]);
      return;
    }

    void syncCounts();
  }, [syncCounts, user]);

  useEffect(() => {
    if (!chatConnection) return;

    const handleFriendRequest = (_payload: TFriendRequestPayload) => {
      setFriendRequestCount((prev) => prev + 1);
    };

    const handleChatNotification = (payload: TChatNotificationPayload) => {
      if (!user) return;

      const selectedFriendId = searchParams.get("friend");
      const isOpenConversation =
        pathname === "/messages" && selectedFriendId === payload.senderId;

      if (!isOpenConversation) {
        setUnreadMessageCount((prev) => prev + 1);
      }
    };

    const handleGameInvite = (payload: TGameInvitePayload) => {
      setGameInvites((prev) =>
        prev.some((invite) => invite.roomId === payload.roomId)
          ? prev
          : [...prev, payload],
      );
    };

    chatConnection.on("friend:request", handleFriendRequest);
    chatConnection.on("chat:notification", handleChatNotification);
    chatConnection.on("GameInvite", handleGameInvite);

    return () => {
      chatConnection.off("friend:request", handleFriendRequest);
      chatConnection.off("chat:notification", handleChatNotification);
      chatConnection.off("GameInvite", handleGameInvite);
    };
  }, [chatConnection, pathname, searchParams, user]);

  const acceptGameInvite = useCallback(
    async (roomId: string) => {
      if (!gameConnection) return;
      await gameConnection.invoke("AcceptInvite", roomId);
      setGameInvites((prev) =>
        prev.filter((invite) => invite.roomId !== roomId),
      );
    },
    [gameConnection],
  );

  const dismissGameInvite = useCallback((roomId: string) => {
    setGameInvites((prev) => prev.filter((invite) => invite.roomId !== roomId));
  }, []);

  const value = useMemo<INotificationState>(
    () => ({
      friendRequestCount,
      unreadMessageCount,
      gameInvites,
      syncCounts,
      refreshUnreadMessages: syncUnreadMessages,
      refreshFriendRequests: syncFriendRequests,
      dismissGameInvite,
      acceptGameInvite,
    }),
    [
      acceptGameInvite,
      dismissGameInvite,
      friendRequestCount,
      gameInvites,
      syncCounts,
      syncFriendRequests,
      syncUnreadMessages,
      unreadMessageCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useDashboardNotifications() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useDashboardNotifications must be used within DashboardNotificationsProvider",
    );
  }

  return ctx;
}
