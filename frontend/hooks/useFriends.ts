"use client";

import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";

function useFriendList() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socialConnection) return;

    const handleFriends = (data: IUserSummary[]) => {
      const sortedFriends = data
        .map((friend) => ({
          ...friend,
          fullName: `${friend.firstName ?? ""} ${friend.lastName ?? ""}`.trim(),
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      setFriends(sortedFriends);
      setLoading(false);
    };

    socialConnection.on("social:friends", handleFriends);

    // Request initial data only on first connect or reconnect
    if (isSocialConnected) {
      socialConnection.invoke("RequestSocialData").catch(() => {});
    }

    return () => {
      socialConnection.off("social:friends", handleFriends);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey]);

  useEffect(() => {
    if (!socialConnection) return;

    const setStatus = (userId: string, status: UserStatusEnum) => {
      setFriends((prev) => prev.map((f) => (f.id === userId ? { ...f, status } : f)));
    };

    const handleOnline = ({ userId }: { userId: string }) => setStatus(userId, UserStatusEnum.Online);
    const handleOffline = ({ userId }: { userId: string }) => setStatus(userId, UserStatusEnum.Offline);
    const handleInGame = ({ userId }: { userId: string }) => setStatus(userId, UserStatusEnum.InGame);

    socialConnection.on("friend:online", handleOnline);
    socialConnection.on("friend:offline", handleOffline);
    socialConnection.on("friend:ingame", handleInGame);

    return () => {
      socialConnection.off("friend:online", handleOnline);
      socialConnection.off("friend:offline", handleOffline);
      socialConnection.off("friend:ingame", handleInGame);
    };
  }, [socialConnection]);

  const reload = useCallback(() => {
    if (socialConnection) {
      setLoading(true);
      socialConnection.invoke("RequestFriends").catch(() => {});
    }
  }, [socialConnection]);

  const onlineCount = useMemo(() => friends.filter((f) => f.status !== UserStatusEnum.Offline).length, [friends]);

  return { friends, loading, onlineCount, reload };
}

function useFriendRequests() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socialConnection) return;

    const handleRequests = (data: { received: IFriendRequestReceived[]; sent: IFriendRequestSent[] }) => {
      setRequests(data.received);
      setSentRequests(data.sent);
      setLoading(false);
    };

    socialConnection.on("social:requests", handleRequests);

    return () => {
      socialConnection.off("social:requests", handleRequests);
    };
  }, [socialConnection]);

  useEffect(() => {
    if (!socialConnection || !isSocialConnected) return;

    // Data is already pushed via SendSocialDataAsync on connect,
    // but we need to ensure we get the data if the event was missed
    const timeoutId = setTimeout(() => {
      if (loading) {
        socialConnection.invoke("RequestFriendRequests").catch(() => {});
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey, loading]);

  const reload = useCallback(() => {
    if (socialConnection) {
      setLoading(true);
      socialConnection.invoke("RequestFriendRequests").catch(() => {});
    }
  }, [socialConnection]);

  const accept = useCallback(async (senderId: string) => {
    try {
      await friendService.acceptFriendRequest(senderId);
    } catch {
      // accept failed — backend will push updated data via SignalR
    }
  }, []);

  const decline = useCallback(async (senderId: string) => {
    try {
      await friendService.rejectFriendRequest(senderId);
    } catch {
      // decline failed — backend will push updated data via SignalR
    }
  }, []);

  const send = useCallback(async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId);
    } catch {
      // send request failed — backend will push updated data via SignalR
    }
  }, []);

  return {
    requests,
    sentRequests,
    loading,
    requestCount: requests.length,
    accept,
    decline,
    send,
    reload,
  };
}

function useBlockedUsers() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViaRest = useCallback(async () => {
    try {
      const response = await friendService.getBlockedUsers();
      setBlockedUsers(response.data ?? []);
    } catch {
      // REST fallback failed — keep whatever we have
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBlockedSignal = useCallback((data: IUserSummary[]) => {
    setBlockedUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!socialConnection) return;

    socialConnection.on("social:blocked", handleBlockedSignal);

    return () => {
      socialConnection.off("social:blocked", handleBlockedSignal);
    };
  }, [socialConnection, handleBlockedSignal]);

  useEffect(() => {
    if (!socialConnection || !isSocialConnected) return;

    // Data is already pushed via SendSocialDataAsync on connect.
    // Only fall back to REST if SignalR push doesn't arrive within 3s.
    let cancelled = false;

    const restFallbackTimer = setTimeout(() => {
      if (!cancelled && loading) fetchViaRest();
    }, 3000);

    return () => {
      cancelled = true;
      clearTimeout(restFallbackTimer);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey, fetchViaRest, loading]);

  const reload = useCallback(() => {
    setLoading(true);
    if (socialConnection) {
      socialConnection.invoke("RequestBlocked")
        .catch(() => fetchViaRest());
    } else {
      fetchViaRest();
    }
  }, [socialConnection, fetchViaRest]);

  return { blockedUsers, loading, reload };
}

function useFriends() {
  const { friends, loading: friendsLoading, onlineCount, reload: reloadFriends } = useFriendList();
  const {
    requests,
    sentRequests,
    loading: requestsLoading,
    requestCount,
    accept: acceptRequest,
    decline: declineRequest,

    send: sendRequest,
    reload: reloadRequests,
  } = useFriendRequests();
  const { blockedUsers, loading: blockedLoading, reload: reloadBlocked } = useBlockedUsers();

  const removeFriend = useCallback(async (friendId: string) => {
    await friendService.removeFriend(friendId);
    reloadFriends();
  }, [reloadFriends]);

  const blockUser = useCallback(async (blockedId: string) => {
    await friendService.blockUser(blockedId);
    reloadFriends();
    reloadBlocked();
  }, [reloadFriends, reloadBlocked]);

  const unblockUser = useCallback(async (blockedId: string) => {
    await friendService.unblockUser(blockedId);
    reloadBlocked();
  }, [reloadBlocked]);

  const cancelFriendRequest = useCallback(async (receiverId: string) => {
    await friendService.cancelFriendRequest(receiverId);
    reloadRequests();
  }, [reloadRequests]);

  const handleAccept = useCallback(async (senderId: string) => {
    await acceptRequest(senderId);
    reloadFriends();
    reloadRequests();
  }, [acceptRequest, reloadFriends, reloadRequests]);

  const handleDecline = useCallback(async (senderId: string) => {
    await declineRequest(senderId);
    reloadRequests();
  }, [declineRequest, reloadRequests]);

  return {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    requestsLoading,
    blockedLoading,
    loading: friendsLoading || requestsLoading || blockedLoading,
    requestCount,
    onlineCount,
    sendRequest,
    acceptRequest: handleAccept,
    declineRequest: handleDecline,
    removeFriend,
    blockUser,
    unblockUser,
    cancelFriendRequest,
    reload: async () => {
      reloadFriends();
      reloadRequests();
      reloadBlocked();
    },
  };
}

export { useFriendList, useFriendRequests, useBlockedUsers, useFriends };