"use client";

import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";

// ─── Friend List ────────────────────────────────────────────────────────────

function useFriendList() {
  const { isSocialConnected, socialReconnectKey } = useConnections();
  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const off1 = friendService.onFriendListUpdate((data) => {
      setFriends(data);
      setLoading(false);
    });

    const off2 = friendService.onFriendStatusChange((userId, status) => {
      const statusMap = { online: UserStatusEnum.Online, offline: UserStatusEnum.Offline, ingame: UserStatusEnum.InGame };
      setFriends((prev) => prev.map((f) => (f.id === userId ? { ...f, status: statusMap[status] } : f)));
    });

    if (isSocialConnected) {
      friendService.invokeSocialData().catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => { off1(); off2(); };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    setLoading(true);
    friendService.invokeFriends().catch(() => {}).finally(() => setLoading(false));
  }, []);

  const onlineCount = useMemo(
    () => friends.filter((f) => f.status !== UserStatusEnum.Offline).length,
    [friends],
  );

  return { friends, loading, onlineCount, reload };
}

// ─── Friend Requests ────────────────────────────────────────────────────────

function useFriendRequests() {
  const { isSocialConnected, socialReconnectKey } = useConnections();
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const off1 = friendService.onFriendRequestUpdate((data) => {
      setRequests(data.received);
      setSentRequests(data.sent);
      setLoading(false);
    });

    if (isSocialConnected) {
      friendService.invokeFriendRequests().catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => { off1(); };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    setLoading(true);
    friendService.invokeFriendRequests().catch(() => {}).finally(() => setLoading(false));
  }, []);

  const accept = useCallback(async (senderId: string) => {
    try { await friendService.acceptFriendRequest(senderId); } catch { /* SignalR pushes update */ }
  }, []);

  const decline = useCallback(async (senderId: string) => {
    try { await friendService.rejectFriendRequest(senderId); } catch { /* SignalR pushes update */ }
  }, []);

  const send = useCallback(async (friendId: string) => {
    try { await friendService.sendFriendRequest(friendId); } catch { /* SignalR pushes update */ }
  }, []);

  const cancel = useCallback(async (receiverId: string) => {
    try { await friendService.cancelFriendRequest(receiverId); } catch { /* SignalR pushes update */ }
  }, []);

  return {
    requests,
    sentRequests,
    loading,
    requestCount: requests.length,
    sentRequestCount: sentRequests.length,
    accept,
    decline,
    send,
    cancel,
    reload,
  };
}

// ─── Blocked Users ──────────────────────────────────────────────────────────

function useBlockedUsers() {
  const { isSocialConnected, socialReconnectKey } = useConnections();
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const off1 = friendService.onBlockedUsersUpdate((data) => {
      setBlockedUsers(data);
      setLoading(false);
    });

    if (isSocialConnected) {
      friendService.invokeBlocked().catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => { off1(); };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    setLoading(true);
    friendService.invokeBlocked().catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { blockedUsers, loading, reload };
}

// ─── Aggregated Hook ────────────────────────────────────────────────────────

function useFriends() {
  const { friends, loading: friendsLoading, onlineCount, reload: reloadFriends } = useFriendList();
  const { requests, sentRequests, loading: requestsLoading, requestCount, sentRequestCount, accept, decline, send, cancel, reload: reloadRequests } = useFriendRequests();
  const { blockedUsers, loading: blockedLoading, reload: reloadBlocked } = useBlockedUsers();

  const removeFriend = useCallback(async (friendId: string) => {
    try { await friendService.removeFriend(friendId); } catch { /* SignalR pushes update */ }
  }, []);

  const blockUser = useCallback(async (blockedId: string) => {
    try { await friendService.blockUser(blockedId); } catch { /* SignalR pushes update */ }
  }, []);

  const unblockUser = useCallback(async (blockedId: string) => {
    try { await friendService.unblockUser(blockedId); } catch { /* SignalR pushes update */ }
  }, []);

  const reload = useCallback(() => {
    reloadFriends();
    reloadRequests();
    reloadBlocked();
  }, [reloadFriends, reloadRequests, reloadBlocked]);

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
    sentRequestCount,
    blockedCount: blockedUsers.length,
    onlineCount,
    sendRequest: send,
    acceptRequest: accept,
    declineRequest: decline,
    removeFriend,
    blockUser,
    unblockUser,
    cancelFriendRequest: cancel,
    reload,
  };
}

export { useFriendList, useFriendRequests, useBlockedUsers, useFriends };
