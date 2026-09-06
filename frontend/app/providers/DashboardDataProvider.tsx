"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { notificationService } from "@/services/def/NotificationService";
import { gameService } from "@/services/def/GameService";
import { friendService } from "@/services/def/FriendService";
import { translateGameInfo } from "@/domain/constant/games";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

import { useConnections } from "./ConnectionProvider";
import { useAuth } from "./AuthProvider";

import type { IDashboardDataProviderProps } from "./def/IProviders";
import type { IDashboardDataContext } from "./def/IDashboardDataContext";
import type { IGameInvite, INotificationItem } from "@/domain/meta/INotification";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { TNullable, TOptional } from "@/domain/type/TCommon";

const DashboardDataContext = createContext<TOptional<IDashboardDataContext>>(undefined);

const NOTIFICATION_TYPES: NotificationTypeEnum[] = [
  NotificationTypeEnum.FriendRequest,
  NotificationTypeEnum.FriendRequestAccepted,
  NotificationTypeEnum.GameInvite,
  NotificationTypeEnum.NewMessage,
];

const normalizeNotification = (n: INotificationItem): INotificationItem => {
  if (typeof n.type === "string") return n;
  const type = NOTIFICATION_TYPES[Number(n.type)];
  return type ? { ...n, type } : n;
};

export function DashboardDataProvider({ children }: IDashboardDataProviderProps) {
  const { isSocialConnected, isSocialConnecting, socialReconnectKey } = useConnections();
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gameT = useGameTranslation();

  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [friendsReceived, setFriendsReceived] = useState(false);
  const [requestsReceived, setRequestsReceived] = useState(false);
  const [blockedReceived, setBlockedReceived] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [liveNotificationsRaw, setLiveNotifications] = useState<INotificationItem[]>([]);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const audioRef = useRef<TNullable<HTMLAudioElement>>(null);
  const soundEnabledRef = useRef(true);
  const notificationsRef = useRef<INotificationItem[]>(notifications);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

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

  const isActiveConversation = useCallback((senderId: TNullable<string>) => {
    if (!senderId) return false;
    return pathnameRef.current === "/messages" && searchParamsRef.current.get("friend") === senderId;
  }, []);

  useEffect(() => {
    const offList = friendService.onFriendListUpdate((data) => {
      setFriends(data);
      setFriendsReceived(true);
    });
    const offStatus = friendService.onFriendStatusChange((userId, status) => {
      setFriends((prev) => prev.map((f) => (f.id === userId ? { ...f, status } : f)));
    });
    const offRequests = friendService.onFriendRequestUpdate((data) => {
      setRequests(data.received ?? []);
      setSentRequests(data.sent ?? []);
      setRequestsReceived(true);
    });
    const offBlocked = friendService.onBlockedUsersUpdate((data) => {
      setBlockedUsers(data);
      setBlockedReceived(true);
    });
    return () => {
      offList();
      offStatus();
      offRequests();
      offBlocked();
    };
  }, []);

  useEffect(() => {
    const off1 = notificationService.onCountersUpdate((c) => {
      setFriendRequestCount(c.receivedFriendRequests ?? 0);
      setUnreadMessageCount(c.unreadMessages ?? 0);
    });
    const off2 = notificationService.onChatNotification((p) => {
      if (!isActiveConversation(p.senderId)) setUnreadMessageCount((n) => n + 1);
      playNotificationSound();
    });
    const off3 = notificationService.onNewNotification((incoming) => {
      const n = normalizeNotification(incoming);

      if (n.type === NotificationTypeEnum.NewMessage && isActiveConversation(n.referenceId)) {
        notificationService.deleteNotification(n.id).catch(() => {});
        return;
      }

      setNotifications((prev) => {
        if (prev.some((x) => x.id === n.id)) {
          return prev.map((x) => (x.id === n.id ? n : x));
        }
        return [n, ...prev];
      });

      setLiveNotifications((prev) => {
        if (prev.some((x) => x.id === n.id)) return prev;
        return [n, ...prev].slice(0, 20);
      });
      playNotificationSound();
    });
    const off4 = notificationService.onNotificationList((incoming) => {
      const list = incoming.map(normalizeNotification);
      setNotifications((prev) => {
        const incomingIds = new Set(list.map((n) => n.id));
        const localOnly = prev.filter((n) => !incomingIds.has(n.id));
        return [...list, ...localOnly].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    });
    return () => {
      off1();
      off2();
      off3();
      off4();
    };
  }, [isActiveConversation]);

  useEffect(() => {
    const off = gameService.onGameInvite((p) => {
      setGameInvites((prev) => (prev.some((i) => i.roomId === p.roomId) ? prev : [...prev, p]));

      const name = p.inviterName ?? gameT.invite.fallbackName;
      let gameLabel = gameT.invite.fallbackName;
      try {
        gameLabel = translateGameInfo(gameT, p.gameType).name;
      } catch {}
      setLiveNotifications((prev) => {
        const id = `invite-${p.roomId}`;
        if (prev.some((n) => n.id === id)) return prev;
        const item: INotificationItem = {
          id,
          type: NotificationTypeEnum.GameInvite,
          title: name,
          body: gameT.invite.receivedDescription.replace("{name}", name).replace("{game}", gameLabel),
          referenceId: p.roomId,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        return [item, ...prev].slice(0, 20);
      });
      playNotificationSound();
    });
    return () => off();
  }, [gameT]);

  const liveNotifications = useMemo(
    () => liveNotificationsRaw.filter((n) => n.type !== NotificationTypeEnum.GameInvite || gameInvites.some((g) => g.roomId === n.referenceId)),
    [liveNotificationsRaw, gameInvites],
  );

  const syncSocial = useCallback(() => {
    friendService.invokeFriends().catch(() => {});
    friendService.invokeFriendRequests().catch(() => {});
    friendService.invokeBlocked().catch(() => {});
    notificationService.requestCounters().catch(() => {});
    notificationService.requestNotificationList().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isSocialConnected) return;
    syncSocial();
  }, [isSocialConnected, socialReconnectKey, syncSocial]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
    notificationService.markNotificationRead(notificationId).catch(() => {});
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notificationService.markAllNotificationsRead().catch(() => {});
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    notificationService.deleteNotification(notificationId).catch(() => {});
  }, []);

  const resolveNotificationsByReference = useCallback((type: NotificationTypeEnum, referenceId: string) => {
    const matches = notificationsRef.current.filter((n) => n.type === type && n.referenceId === referenceId);
    if (matches.length === 0) return;
    setNotifications((prev) => prev.filter((n) => !(n.type === type && n.referenceId === referenceId)));
    matches.forEach((n) => notificationService.deleteNotification(n.id).catch(() => {}));
  }, []);

  useEffect(() => {
    if (pathname !== "/messages") return;
    const friendId = searchParams.get("friend");
    if (friendId) resolveNotificationsByReference(NotificationTypeEnum.NewMessage, friendId);
  }, [pathname, searchParams, resolveNotificationsByReference]);

  useEffect(() => {
    if (!requestsReceived) return;
    const pendingIds = new Set(requests.map((r) => r.senderId));
    notifications
      .filter((n) => n.type === NotificationTypeEnum.FriendRequest && n.referenceId != null && !pendingIds.has(n.referenceId))
      .forEach((n) => deleteNotification(n.id));
  }, [requestsReceived, requests, notifications, deleteNotification]);

  const sendRequest = useCallback(async (friendId: string) => {
    await friendService.sendFriendRequest(friendId);
  }, []);

  const acceptRequest = useCallback(
    async (senderId: string) => {
      await friendService.acceptFriendRequest(senderId);
      resolveNotificationsByReference(NotificationTypeEnum.FriendRequest, senderId);
    },
    [resolveNotificationsByReference],
  );

  const declineRequest = useCallback(
    async (senderId: string) => {
      await friendService.rejectFriendRequest(senderId);
      resolveNotificationsByReference(NotificationTypeEnum.FriendRequest, senderId);
    },
    [resolveNotificationsByReference],
  );

  const cancelRequest = useCallback(async (receiverId: string) => {
    await friendService.cancelFriendRequest(receiverId);
    setSentRequests((prev) => prev.filter((r) => r.receiverId !== receiverId));
  }, []);

  const removeFriend = useCallback(async (friendId: string) => {
    await friendService.removeFriend(friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  }, []);

  const blockUser = useCallback(async (blockedId: string) => {
    await friendService.blockUser(blockedId);
    setFriends((prev) => prev.filter((f) => f.id !== blockedId));
    setRequests((prev) => prev.filter((r) => r.senderId !== blockedId));
    setSentRequests((prev) => prev.filter((r) => r.receiverId !== blockedId));
  }, []);

  const unblockUser = useCallback(async (blockedId: string) => {
    await friendService.unblockUser(blockedId);
    setBlockedUsers((prev) => prev.filter((b) => b.id !== blockedId));
  }, []);

  const dismissGameInvite = useCallback(
    (roomId: string) => {
      setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
      resolveNotificationsByReference(NotificationTypeEnum.GameInvite, roomId);
    },
    [resolveNotificationsByReference],
  );

  const acceptGameInvite = useCallback(
    async (roomId: string) => {
      await gameService.acceptInvite(roomId);
      setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
      resolveNotificationsByReference(NotificationTypeEnum.GameInvite, roomId);
    },
    [resolveNotificationsByReference],
  );

  const reload = syncSocial;

  const friendsLoading = isSocialConnecting || (isSocialConnected && !friendsReceived);
  const requestsLoading = isSocialConnecting || (isSocialConnected && !requestsReceived);
  const blockedLoading = isSocialConnecting || (isSocialConnected && !blockedReceived);
  const loading = friendsLoading || requestsLoading || blockedLoading;
  const isOffline = !isSocialConnected && !isSocialConnecting;
  const onlineCount = friends.filter((f) => f.status !== UserStatusEnum.Offline).length;
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const value = useMemo<IDashboardDataContext>(
    () => ({
      friends,
      requests,
      sentRequests,
      blockedUsers,
      friendsLoading,
      requestsLoading,
      blockedLoading,
      loading,
      isOffline,
      onlineCount,
      requestCount: requests.length,
      sentRequestCount: sentRequests.length,
      blockedCount: blockedUsers.length,
      friendRequestCount,
      unreadMessageCount,
      unreadNotificationCount,
      gameInvites,
      notifications,
      liveNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      sendRequest,
      acceptRequest,
      declineRequest,
      cancelRequest,
      removeFriend,
      blockUser,
      unblockUser,
      dismissGameInvite,
      acceptGameInvite,
      reload,
    }),
    [
      friends,
      requests,
      sentRequests,
      blockedUsers,
      friendsLoading,
      requestsLoading,
      blockedLoading,
      loading,
      isOffline,
      onlineCount,
      friendRequestCount,
      unreadMessageCount,
      unreadNotificationCount,
      gameInvites,
      notifications,
      liveNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      sendRequest,
      acceptRequest,
      declineRequest,
      cancelRequest,
      removeFriend,
      blockUser,
      unblockUser,
      dismissGameInvite,
      acceptGameInvite,
      reload,
    ],
  );

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData(): IDashboardDataContext {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboardData must be used within DashboardDataProvider");
  return ctx;
}