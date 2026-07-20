export const en = {
  badge: "Notifications",
  title: "Notifications",
  subtitle: "All your notifications in one place",
  tabs: {
    all: "All",
    gameInvites: "Game Invites",
    friendRequests: "Friend Requests",
    messages: "Messages",
  },
  empty: {
    title: "No notifications",
    description: "You're all caught up!",
  },
  gameInvite: {
    title: "Game Invitation",
    description: "{name} invited you to play {game}",
  },
  friendRequest: {
    title: "Friend Request",
    description: "{name} wants to be your friend",
    accept: "Accept",
    decline: "Decline",
  },
  message: {
    title: "New Message",
    description: "{name}: {preview}",
  },
  actions: {
    view: "View",
    accept: "Accept",
    decline: "Decline",
    dismiss: "Dismiss",
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