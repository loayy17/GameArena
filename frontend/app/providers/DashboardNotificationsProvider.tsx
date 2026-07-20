"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConnections } from "./ConnectionProvider";
import { useAuth } from "./AuthProvider";
import { notificationService } from "@/services/def/NotificationService";
import { gameService } from "@/services/def/GameService";
import type { IGameInvite, INotificationItem, INotificationState } from "@/domain/meta/INotification";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";

const NotificationContext = createContext<INotificationState | undefined>(undefined);

export function DashboardNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { isSocialConnected, socialReconnectKey } = useConnections();
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(true);

  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);

  useEffect(() => {
    if (user?.preferences) {
      try {
        const prefs = JSON.parse(user.preferences) as IUserPreferences;
        soundEnabledRef.current = prefs.soundEnabled ?? true;
      } catch {
        soundEnabledRef.current = true;
      }
    }
  }, [user?.preferences]);

  const playNotificationSound = () => {
    if (!soundEnabledRef.current) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/1877.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    const off1 = notificationService.onCountersUpdate((c) => {
      setFriendRequestCount(c.receivedFriendRequests ?? 0);
      setUnreadMessageCount(c.unreadMessages ?? 0);
    });
    const off2 = notificationService.onChatNotification((p) => {
      const selected = searchParamsRef.current.get("friend");
      if (pathnameRef.current !== "/messages" || selected !== p.senderId)
        setUnreadMessageCount((n) => n + 1);
      playNotificationSound();
    });
    const off3 = notificationService.onNewNotification((n) => {
      setNotifications((prev) => [n, ...prev]);
      playNotificationSound();
    });
    const off4 = notificationService.onNotificationList(setNotifications);
    return () => { off1(); off2(); off3(); off4(); };
  }, []);

  useEffect(() => {
    if (!isSocialConnected) return;
    notificationService.requestCounters().catch(() => {});
    notificationService.requestNotificationList().catch(() => {});
    const t = setTimeout(() => {
      notificationService.requestCounters().catch(() => {});
      notificationService.requestNotificationList().catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [isSocialConnected, socialReconnectKey]);

  useEffect(() => {
    const off = gameService.onGameInvite((p) => {
      setGameInvites((prev) => prev.some((i) => i.roomId === p.roomId) ? prev : [...prev, p]);
      playNotificationSound();
    });
    return () => off();
  }, []);

  const unreadNotificationCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const value = useMemo<INotificationState>(() => ({
    friendRequestCount,
    unreadMessageCount,
    unreadNotificationCount,
    gameInvites,
    notifications,
    dismissGameInvite: (roomId) => setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId)),
    acceptGameInvite: async (roomId) => { await gameService.acceptInvite(roomId); setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId)); },
  }), [friendRequestCount, unreadMessageCount, unreadNotificationCount, gameInvites, notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useDashboardNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useDashboardNotifications must be used within DashboardNotificationsProvider");
  return ctx;
}
