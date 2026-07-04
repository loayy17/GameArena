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
import { useAuth } from "@/app/providers/AuthProvider";
import { chatService } from "@/services/def/ChatService";
import { friendService } from "@/services/def/FriendService";
import { useConnections } from "./ConnectionProvider";
import { onFriendRequestChange } from "@/lib/friendEvents";
import type {
  IGameInvite,
  INotificationState,
} from "@/domain/meta/INotification";
import type { IChatNotificationPayload } from "@/domain/meta/IChatNotificationPayload";

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
  const { socialConnection, gameConnection } = useConnections();
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);

  const refreshFriendRequests = useCallback(async () => {
    try {
      const response = await friendService.getReceivedFriendRequests();
      setFriendRequestCount(response.data?.length ?? 0);
    } catch (error) {
      console.error("Failed to sync friend requests", error);
    }
  }, []);

  const refreshUnreadMessages = useCallback(async () => {
    try {
      const response = await chatService.getUnreadMessageCount();
      setUnreadMessageCount(response.data ?? 0);
    } catch (error) {
      console.error("Failed to sync unread messages", error);
    }
  }, []);

  const syncCounts = useCallback(async () => {
    await Promise.all([refreshFriendRequests(), refreshUnreadMessages()]);
  }, [refreshFriendRequests, refreshUnreadMessages]);

  useEffect(() => {
    if (!user) {
      setFriendRequestCount(0);
      setUnreadMessageCount(0);
      setGameInvites([]);
      return;
    }

    void syncCounts();
  }, [user, syncCounts]);

  useEffect(() => {
    if (!socialConnection) return;

    const handleFriendRequest = () => { void refreshFriendRequests(); };
    const handleAccepted = () => { void refreshFriendRequests(); };
    const handleDeclined = () => { void refreshFriendRequests(); };

    const handleChatNotification = (payload: IChatNotificationPayload) => {
      if (!user) return;

      const selectedFriendId = searchParams.get("friend");
      const isOpenConversation =
        pathname === "/messages" && selectedFriendId === payload.senderId;

      if (!isOpenConversation) {
        setUnreadMessageCount((prev) => prev + 1);
      }
    };

    const handleGameInvite = (payload: IGameInvite) => {
      setGameInvites((prev) =>
        prev.some((i) => i.roomId === payload.roomId)
          ? prev
          : [...prev, payload],
      );
    };

    socialConnection.on("friend:request", handleFriendRequest);
    socialConnection.on("friend:accepted", handleAccepted);
    socialConnection.on("friend:declined", handleDeclined);
    socialConnection.on("chat:notification", handleChatNotification);
    socialConnection.on("game:invite", handleGameInvite);

    const unsub = onFriendRequestChange(() => { void refreshFriendRequests(); });

    return () => {
      socialConnection.off("friend:request", handleFriendRequest);
      socialConnection.off("friend:accepted", handleAccepted);
      socialConnection.off("friend:declined", handleDeclined);
      socialConnection.off("chat:notification", handleChatNotification);
      socialConnection.off("game:invite", handleGameInvite);
      unsub();
    };
  }, [socialConnection, pathname, searchParams, user, refreshFriendRequests]);

  const acceptGameInvite = useCallback(
    async (roomId: string) => {
      if (!gameConnection) return;

      await gameConnection.invoke("AcceptInvite", roomId);

      setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
    },
    [gameConnection],
  );

  const dismissGameInvite = useCallback((roomId: string) => {
    setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
  }, []);

  const value = useMemo<INotificationState>(
    () => ({
      friendRequestCount,
      unreadMessageCount,
      gameInvites,
      syncCounts,
      refreshUnreadMessages,
      refreshFriendRequests,
      dismissGameInvite,
      acceptGameInvite,
    }),
    [
      friendRequestCount,
      unreadMessageCount,
      gameInvites,
      syncCounts,
      refreshUnreadMessages,
      refreshFriendRequests,
      dismissGameInvite,
      acceptGameInvite,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useDashboardNotifications(): INotificationState {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useDashboardNotifications must be used within DashboardNotificationsProvider.",
    );
  }
  return ctx;
}
