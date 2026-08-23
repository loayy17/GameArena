"use client";

import { useMemo } from "react";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";

function useNavBadges() {
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardData();

  return useMemo(
    () => ({
      friends: friendRequestCount,
      messages: unreadMessageCount,
      invites: gameInvites.length + unreadNotificationCount,
    }),
    [friendRequestCount, unreadMessageCount, gameInvites.length, unreadNotificationCount],
  );
}

export { useNavBadges };
