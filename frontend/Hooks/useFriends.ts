// hooks/useFriends.ts
"use client";

import { userApi } from "@/lib/user.api";
import { User } from "@/types";
import { useState, useEffect, useCallback } from "react";

export function useFriends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<any[]>([]); // FriendRequestDto[]
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<any[]>([]);

  const cancelSentRequest = async (receiverId: string) => {
    await userApi.cancelRequest(receiverId);
    await load();
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, requestsRes, sentRes] = await Promise.all([
        userApi.getFriends(),
        userApi.getRequests(),
        userApi.getSentRequests(),
      ]);
      setFriends(friendsRes.data.data || []);
      setRequests(requestsRes.data.data || []);
      setSentRequests(sentRes.data.data || []);
    } catch (error) {
      console.error("Failed to load friends data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sendRequest = useCallback(
    async (receiverId: string) => {
      try {
        await userApi.sendRequest(receiverId);
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
        await userApi.acceptRequest(senderId);
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
        await userApi.declineRequest(senderId);
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
    cancelSentRequest,
  };
}
