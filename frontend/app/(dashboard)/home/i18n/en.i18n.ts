const en = {
  welcome: (name: string) => `Welcome back${name ? `, ${name}` : ""}`,
  welcomeDesc: "Pick a game, invite a friend and climb the ranks.",
  playNow: "Play now",
  record: {
    wins: "Wins",
    losses: "Losses",
    draws: "Draws"
  },
  unreadMessages: "Unread messages",
  friendRequests: "Friend requests",
  gamesTitle: "Games",
  viewAllGames: "View all",
  recentHistory: {
    title: "Recent Battles",
    viewAll: "View all",
    emptyTitle: "No battles yet",
    emptyDescription: "Play your first match and your history will show up here."
  }
};

type THomeTranslation = typeof en;
export { en, type THomeTranslation };
