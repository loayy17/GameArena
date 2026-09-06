export const en = {
  badge: "Notifications",
  title: "Notifications",
  subtitle: "All your notifications in one place",
  tabs: {
    all: "All",
    gameInvites: "Game Invites",
    friendRequests: "Friend Requests",
    messages: "Messages",
    other: "Other",
  },
  empty: {
    title: "No notifications",
    description: "You're all caught up!",
  },
  error: {
    title: "Unable to load requests",
  },
  friendRequest: {
    title: "Friend Request",
    description: "{name} wants to be your friend",
  },
  actions: {
    dismiss: "Dismiss",
    accept: "Accept",
    decline: "Decline",
    reply: "Reply",
    markRead: "Mark as read",
    error: "Action failed. Please try again.",
  },
  time: {
    justNow: "Just now",
    minutesAgo: "{n} min ago",
    hoursAgo: "{n} hr ago",
    daysAgo: "{n} day ago",
  },
  markAllRead: "Mark all as read",
};

export type TNotificationsTranslation = typeof en;
