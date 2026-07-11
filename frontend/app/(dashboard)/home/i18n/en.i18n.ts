const en = {
  welcome: (name: string) => "Welcome back" + (name ? `, ${name}` : ""),
  brand: "Arena404",
  enterArena: "Enter the arena. Pick your battle.",
  playNow: "PLAY NOW",
  stats: {
    gamesAvailable: "Games available",
    unreadMessages: "Unread messages",
    friendRequests: "Friend requests",
  },
  games: {
    snake: "Snake",
    snakeDesc: "Classic arcade — eat & survive",
    ticTacToe: "Tic Tac Toe",
    ticTacToeDesc: "3×3 tactical duel",
    pong: "Pong",
    pongDesc: "Retro table tennis",
  },
  recentHistory: {
    title: "Recent Battles",
    viewAll: "View all",
    emptyTitle: "No battles yet",
    emptyDescription: "Play your first match and your history will show up here.",
  },
};

type THomeTranslation = typeof en;
export { en, type THomeTranslation };
