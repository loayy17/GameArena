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
      setFriends(data);
      setLoading(false);
    };

    socialConnection.on("social:friends", handleFriends);

    return () => {
      socialConnection.off("social:friends", handleFriends);
    };
  }, [socialConnection]);

  useEffect(() => {
    if (!socialConnection || !isSocialConnected) return;

    const invokeRequest = () => {
      socialConnection.invoke("RequestFriends").catch(() => {});
    };

    invokeRequest();

    const retryTimer = setTimeout(invokeRequest, 500);

    return () => {
      clearTimeout(retryTimer);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey]);

  useEffect(() => {
    if (!socialConnection) return;

    const setStatus = (userId: string, status: UserStatusEnum) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === userId ? { ...f, status } : f)),
      );
    };

    const handleOnline = ({ userId }: { userId: string }) =>
      setStatus(userId, UserStatusEnum.Online);
    const handleOffline = ({ userId }: { userId: string }) =>
      setStatus(userId, UserStatusEnum.Offline);
    const handleInGame = ({ userId }: { userId: string }) =>
      setStatus(userId, UserStatusEnum.InGame);

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

  const onlineCount = useMemo(
    () => friends.filter((f) => f.status !== UserStatusEnum.Offline).length,
    [friends],
  );

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

    const invokeRequest = () => {
      socialConnection.invoke("RequestFriendRequests").catch(() => {});
    };

    invokeRequest();

    const retryTimer = setTimeout(invokeRequest, 500);

    return () => {
      clearTimeout(retryTimer);
    };
  }, [socialConnection, isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    if (socialConnection) {
      setLoading(true);
      socialConnection.invoke("RequestFriendRequests").catch(() => {});
    }
  }, [socialConnection]);

  const accept = useCallback(
    async (senderId: string) => {
      try {
        await friendService.acceptFriendRequest(senderId);
      } catch {
        // accept failed — backend will push updated data via SignalR
      }
    },
    [],
  );

  const decline = useCallback(
    async (senderId: string) => {
      try {
        await friendService.rejectFriendRequest(senderId);
      } catch {
        // decline failed — backend will push updated data via SignalR
      }
    },
    [],
  );

  const send = useCallback(
    async (friendId: string) => {
      try {
        await friendService.sendFriendRequest(friendId);
      } catch {
        // send request failed — backend will push updated data via SignalR
      }
    },
    [],
  );

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

function useFriends() {
  const {
    friends,
    loading: friendsLoading,
    onlineCount,
    reload: reloadFriends,
  } = useFriendList();
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

  const removeFriend = useCallback(
    async (friendId: string) => {
      await friendService.removeFriend(friendId);
    },
    [],
  );

  const blockUser = useCallback(
    async (blockedId: string) => {
      await friendService.blockUser(blockedId);
    },
    [],
  );

  const unblockUser = useCallback(async (blockedId: string) => {
    await friendService.unblockUser(blockedId);
  }, []);

  return {
    friends,
    requests,
    sentRequests,
    loading: friendsLoading || requestsLoading,
    requestCount,
    onlineCount,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    blockUser,
    unblockUser,
    reload: async () => {
      reloadFriends();
      reloadRequests();
    },
  };
}

export { useFriendList, useFriendRequests, useFriends };
