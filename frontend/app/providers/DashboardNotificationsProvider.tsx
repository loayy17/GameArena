"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "./ConnectionProvider";
import type { IGameInvite, INotificationState } from "@/domain/meta/INotification";
import type { IChatNotificationPayload } from "@/domain/meta/IChatNotificationPayload";

interface INotificationCounters {
  friendRequests: number;
  unreadMessages: number;
}

const NotificationContext = createContext<INotificationState | undefined>(undefined);

export function DashboardNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { socialConnection, isSocialConnected, socialReconnectKey, gameConnection } = useConnections();
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);

  useEffect(() => {
    if (!user) {
      setFriendRequestCount(0);
      setUnreadMessageCount(0);
      setGameInvites([]);
    }
  }, [user]);

  useEffect(() => {
    if (!socialConnection) return;

    const handleNotificationUpdate = (counters: INotificationCounters) => {
      setFriendRequestCount(counters.friendRequests);
      setUnreadMessageCount(counters.unreadMessages);
    };

    const handleChatNotification = (payload: IChatNotificationPayload) => {
      if (!user) return;

      const selectedFriendId = searchParamsRef.current.get("friend");
      const isOpenConversation = pathnameRef.current === "/messages" && selectedFriendId === payload.senderId;

      if (!isOpenConversation) {
        setUnreadMessageCount((prev) => prev + 1);
      }
    };

    socialConnection.on("notification:update", handleNotificationUpdate);
    socialConnection.on("chat:notification", handleChatNotification);

    return () => {
      socialConnection.off("notification:update", handleNotificationUpdate);
      socialConnection.off("chat:notification", handleChatNotification);
    };
  }, [socialConnection, user]);

  useEffect(() => {
    if (!socialConnection || !isSocialConnected) return;

    const invokeRequest = () => {
      socialConnection.invoke("RequestCounters").catch(() => {});
    };

    invokeRequest();

    const retryTimer = setTimeout(invokeRequest, 500);

    return () => {
      clearTimeout(retryTimer);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey]);

  useEffect(() => {
    if (!gameConnection) return;

    const handleGameInvite = (payload: IGameInvite) => {
      setGameInvites((prev) => (prev.some((i) => i.roomId === payload.roomId) ? prev : [...prev, payload]));
    };

    gameConnection.on("game:invite", handleGameInvite);

    return () => {
      gameConnection.off("game:invite", handleGameInvite);
    };
  }, [gameConnection]);

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
      dismissGameInvite,
      acceptGameInvite,
    }),
    [friendRequestCount, unreadMessageCount, gameInvites, dismissGameInvite, acceptGameInvite],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useDashboardNotifications(): INotificationState {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useDashboardNotifications must be used within DashboardNotificationsProvider.");
  }
  return ctx;
}
