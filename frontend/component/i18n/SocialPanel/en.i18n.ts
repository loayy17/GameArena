const en = {
  title: "Friends",
  online: "online",
  message: "Message",
  active: "Active",
  searchPlaceholder: "Search friends...",
  friendsAndInvites: "Friends and invites",
  tabs: {
    friends: "Friends",
    invites: "Invites",
  },
  invites: {
    wantsToPlay: "{{name}} wants to play",
    accept: "Accept",
    decline: "Decline",
  },
  leaveTitle: "Leave current game?",
  leaveDesc: "You have an active game. Leave it to accept the invite?",
  cancel: "Cancel",
  leaveAccept: "Leave & Accept",
  noFriendsTitle: "No friends yet",
  noFriendsDescription: "Start connecting with other players to build your friends list.",
  noInvitesTitle: "No invites yet",
  noInvitesDescription: "When someone invites you to play, it will show up here.",
  noOnlineTitle: "No friends online",
  noOnlineDescription: "Your online friends will appear here for quick access.",
};

type TSocialPanelTranslation = typeof en;
export { en, type TSocialPanelTranslation };
