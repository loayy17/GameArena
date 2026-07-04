"use client";

import { friendService } from "@/services/def/FriendService";
import type { IUser } from "@/domain/meta/IUser";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { notifyFriendRequestChange } from "@/lib/friendEvents";
import { useFetch } from "./useFetch";

function useFriendList() {
  const { socialConnection } = useConnections();
  const [friends, setFriends] = useState<IUser[]>([]);
  const { data: fetched, loading, reload } = useFetch(
    () =>
      friendService
        .getFriends({ name: null, userStatus: UserStatusEnum.All })
        .then((res) => res.data ?? []),
    [],
  );

  useEffect(() => {
    if (fetched) setFriends(fetched);
  }, [fetched]);

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
    const handleAccepted = () => reload();
    const handleRemoved = () => reload();

    socialConnection.on("friend:online", handleOnline);
    socialConnection.on("friend:offline", handleOffline);
    socialConnection.on("friend:ingame", handleInGame);
    socialConnection.on("friend:accepted", handleAccepted);
    socialConnection.on("friend:removed", handleRemoved);

    return () => {
      socialConnection.off("friend:online", handleOnline);
      socialConnection.off("friend:offline", handleOffline);
      socialConnection.off("friend:ingame", handleInGame);
      socialConnection.off("friend:accepted", handleAccepted);
      socialConnection.off("friend:removed", handleRemoved);
    };
  }, [socialConnection, reload]);

  const onlineCount = useMemo(
    () => friends.filter((f) => f.status !== UserStatusEnum.Offline).length,
    [friends],
  );

  return { friends, loading, onlineCount, reload };
}

function useFriendRequests() {
  const { socialConnection } = useConnections();
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);

  const { data: recv, loading: recvLoading, reload: reloadRecv } = useFetch(
    () => friendService.getReceivedFriendRequests().then((res) => res.data ?? []),
    [],
  );
  const { data: sent, loading: sentLoading, reload: reloadSent } = useFetch(
    () => friendService.getSentFriendRequests().then((res) => res.data ?? []),
    [],
  );

  useEffect(() => {
    if (recv) setRequests(recv);
  }, [recv]);
  useEffect(() => {
    if (sent) setSentRequests(sent);
  }, [sent]);

  const reloadAll = useCallback(async () => {
    await Promise.all([reloadRecv(), reloadSent()]);
  }, [reloadRecv, reloadSent]);

  useEffect(() => {
    if (!socialConnection) return;

    const handleDeclined = () => reloadAll();
    const handleAccepted = () => reloadAll();

    socialConnection.on("friend:declined", handleDeclined);
    socialConnection.on("friend:accepted", handleAccepted);

    return () => {
      socialConnection.off("friend:declined", handleDeclined);
      socialConnection.off("friend:accepted", handleAccepted);
    };
  }, [socialConnection, reloadAll]);

  const accept = useCallback(
    async (senderId: string) => {
      try {
        await friendService.acceptFriendRequest(senderId);
        await reloadAll();
        notifyFriendRequestChange();
      } catch (error) {
        console.error("Failed to accept friend request", error);
      }
    },
    [reloadAll],
  );

  const decline = useCallback(
    async (senderId: string) => {
      try {
        await friendService.rejectFriendRequest(senderId);
        await reloadAll();
        notifyFriendRequestChange();
      } catch (error) {
        console.error("Failed to decline friend request", error);
      }
    },
    [reloadAll],
  );

  const send = useCallback(
    async (friendId: string) => {
      try {
        await friendService.sendFriendRequest(friendId);
        await reloadAll();
        notifyFriendRequestChange();
      } catch (error) {
        console.error("Failed to send friend request", error);
      }
    },
    [reloadAll],
  );

  return {
    requests,
    sentRequests,
    loading: recvLoading || sentLoading,
    requestCount: requests.length,
    accept,
    decline,
    send,
    reload: reloadAll,
  };
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

  const removeFriend = useCallback(async (friendId: string) => {
    await friendService.removeFriend(friendId);
    await reloadFriends();
  }, [reloadFriends]);

  const blockUser = useCallback(async (blockedId: string) => {
    await friendService.blockUser(blockedId);
    await reloadFriends();
  }, [reloadFriends]);

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
    reload: async () => { await Promise.all([reloadFriends(), reloadRequests()]); },
  };
}

export { useFriendList, useFriendRequests, useFriends };
