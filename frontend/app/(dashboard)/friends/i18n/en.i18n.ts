const en = {
  requests: "Requests",
  friends: "Friends",
  sentRequests: "Sent Requests",
  blockedUsers: "Blocked Users",
  search: "Search",
  message: "Message",
  invite: "Invite",
  addFriend: "Add Friend",
  subtitle: "Manage your social network in one place. Browse your friends, review incoming and sent friend requests, discover new players, and manage blocked users without leaving the page.",
  community: "Community",
  noFriendsTitle: "No friends yet",
  noFriendsDescription: "Search for users and add them as friends.",
  searchTab: {
    placeholder: "Search users by name or email...",
    clearSearch: "Clear search",
    allStatuses: "All Statuses",
    online: "Online",
    offline: "Offline",
    inGame: "In Game",
    hint: "Start typing a name or email to search available users.",
    searchError: "Failed to search users. Please try again.",
    sendError: "Failed to send request. Please try again.",
    noResults: "No users matched your search.",
    requestSent: "Request Sent",
    add: "Add",
    emptyHint: "Use the search field above to look up users.",
    noUsername: "No username",
    unknownUser: "Unknown user"
  },
  requestsTab: {
    emptyTitle: "No pending requests",
    emptyDescription: "You're all caught up! No friend requests to review.",
    accept: "Accept request",
    decline: "Decline request"
  },
  sentTab: {
    emptyTitle: "No sent requests",
    emptyDescription: "You haven't sent any friend requests yet.",
    cancel: "Cancel request"
  },
  blockedTab: {
    emptyTitle: "No blocked users",
    emptyDescription: "You haven't blocked anyone.",
    unblock: "Unblock"
  },
  actions: {
    block: "Block user",
    removeFriend: "Remove friend"
  },
  confirm: {
    blockTitle: "Block user?",
    blockDesc: "The user will be removed from your friends and blocked. You can unblock them later from the Blocked tab.",
    removeTitle: "Remove friend?",
    removeDesc: "This friend will be removed from your list. You can send a new request later.",
    cancelTitle: "Cancel request?",
    cancelDesc: "This friend request will be cancelled.",
    confirm: "Confirm",
    cancel: "Cancel"
  },
  offlineWarning: "You are offline — data may be outdated. Reconnecting...",
  error: {
    title: "Error",
    retry: "Retry"
  }
}
;

type TFriendsTranslation = typeof en;
export { en, type TFriendsTranslation };
