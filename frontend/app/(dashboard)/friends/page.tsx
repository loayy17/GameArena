// app/friends/page.tsx (or wherever your friends page lives)
"use client";

import { useState, useEffect } from "react";
import { useFriends } from "@/Hooks/useFriends";
import { userApi } from "@/lib/user.api";
import { useTranslation } from "@/Hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useConnection } from "@/Hooks/useConnection";
import { GamesKindEnum } from "@/types";
import ar from "./i18n/ar.i18n"; // adjust path
import en, { TFriendsTranslation } from "./i18n/en.i18n";
import {
  Search,
  UserPlus,
  MessageSquare,
  Gamepad2,
  Check,
  X,
  Loader2,
} from "lucide-react";

export default function Friends() {
  const router = useRouter();
  const { connection: gameHub } = useConnection("gameHub");
  const {
    friends,
    requests,
    loading,
    sendRequest,
    acceptRequest,
    declineRequest,
  } = useFriends();
  const t = useTranslation({ en, ar }) as TFriendsTranslation;

  // ---- Search logic ----
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setSearching(true);
        try {
          const res = await userApi.search(searchQuery);
          setSearchResults(res.data.data || []);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendRequest = async (receiverId: string) => {
    await sendRequest(receiverId);
    // Remove from search results to provide instant feedback
    setSearchResults((prev) => prev.filter((u) => u.id !== receiverId));
  };

  // ---- Game invite ----
  const handleInvite = async (friendId: string) => {
    if (!gameHub) return;
    try {
      await gameHub.invoke("InviteFriend", friendId, GamesKindEnum.TicTacTao);
    } catch (error) {
      console.error("Invite failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full relative z-10 px-4 sm:px-8 py-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-white mb-6">{t.friends}</h1>

      {/* ---- Search Bar ---- */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary outline-none"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {/* ---- Search Results ---- */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Search Results
          </h2>
          <div className="space-y-3">
            {searchResults.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=7c5cfc&color=fff`}
                    className="w-10 h-10 rounded-lg object-cover"
                    alt=""
                  />
                  <div>
                    <p className="text-white font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-text-secondary text-xs">
                      @{user.userName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  {t.addFriend || "Add Friend"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Friend Requests ---- */}
      {requests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            {t.requests || "Friend Requests"}
          </h2>
          <div className="space-y-2">
            {requests.map((req: any) => (
              <div
                key={req.senderId}
                className="flex items-center justify-between bg-bg-card p-3 rounded-lg"
              >
                <span className="text-white">
                  {req.senderFirstName} {req.senderLastName} (@
                  {req.senderUserName})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(req.senderId)}
                    className="text-green-400 hover:text-green-300"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => declineRequest(req.senderId)}
                    className="text-red-400 hover:text-red-300"
                    title="Decline"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Friends List ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {friends.map((friend: any) => (
          <div
            key={friend.id}
            className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${friend.firstName}+${friend.lastName}&background=7c5cfc&color=fff`}
              className="w-16 h-16 rounded-xl mb-2"
              alt=""
            />
            <h3 className="text-white font-semibold">
              {friend.firstName} {friend.lastName}
            </h3>
            <p className="text-text-secondary text-sm">@{friend.userName}</p>
            <div className="flex gap-2 mt-4 w-full">
              <button
                onClick={() => router.push(`/messages?friend=${friend.id}`)}
                className="flex-1 py-2 bg-primary text-white rounded-lg text-sm flex items-center justify-center gap-1"
              >
                <MessageSquare size={16} /> {t.message}
              </button>
              <button
                onClick={() => handleInvite(friend.id)}
                className="flex-1 py-2 bg-surface border border-border text-text rounded-lg text-sm flex items-center justify-center gap-1"
              >
                <Gamepad2 size={16} /> {t.invite}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && friends.length === 0 && requests.length === 0 && (
        <div className="text-center mt-10 text-text-secondary">
          <p className="text-lg">No friends yet</p>
          <p className="text-sm">Search for users above to add them!</p>
        </div>
      )}
    </div>
  );
}
