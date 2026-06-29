"use client";

import { friendService } from "@/services/def/FriendService";
import type { IUser } from "@/domain/meta/IUser";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useState, useEffect, useCallback } from "react";

export function useFriends() {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, requestsRes, sentRes] = await Promise.all([
        friendService.getFriends({
          name: null,
          userStatus: UserStatusEnum.All,
        }),
        friendService.getReceivedFriendRequests(),
        friendService.getSentFriendRequests(),
      ]);
      setFriends(friendsRes.data ?? []);
      setRequests(requestsRes.data ?? []);
      setSentRequests(sentRes.data ?? []);
    } catch (error) {
      console.error("Failed to load friends data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  const sendRequest = useCallback(
    async (friendId: string) => {
      try {
        await friendService.sendFriendRequest(friendId);
        await load();
      } catch (error) {
        console.error("Failed to send friend request", error);
      }
    },
    [load],
  );

  const acceptRequest = useCallback(
    async (senderId: string) => {
      try {
        await friendService.acceptFriendRequest(senderId);
        await load();
      } catch (error) {
        console.error("Failed to accept friend request", error);
      }
    },
    [load],
  );

  const declineRequest = useCallback(
    async (senderId: string) => {
      try {
        await friendService.rejectFriendRequest(senderId);
        await load();
      } catch (error) {
        console.error("Failed to decline friend request", error);
      }
    },
    [load],
  );

  return {
    friends,
    requests,
    loading,
    sendRequest,
    acceptRequest,
    declineRequest,
    reload: load,
    sentRequests,
  };
}
