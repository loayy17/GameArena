const en = {
  title: "Profile",
  memberSince: "Member since",
  level: "Lvl",
  shareFailed: "Could not copy the link.",
  actions: {
    editProfile: "Edit Profile",
    addFriend: "Add Friend",
    unsend: "Unsend Request",
    accept: "Accept",
    decline: "Decline",
    unblock: "Unblock",
    message: "Message",
    share: "Share",
    linkCopied: "Link Copied",
    loading: "Loading...",
  },
  stats: {
    total: "Matches",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    winRate: "Win Rate",
  },
  recentMatches: "Recent Matches",
  noMatches: "No matches played yet",
  noMatchesDescription: "Matches you play will show up here.",
  versus: "vs",
  back: "Back",
  errorTitle: "Could not load profile",
  errorDescription: "This profile may not exist or is temporarily unavailable.",
  retry: "Retry",
};

type TUserProfileTranslation = typeof en;

export { en, type TUserProfileTranslation };