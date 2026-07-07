const en = {
  welcome: "Welcome to GameArena",
  enterArena: "Enter the arena. Pick your battle.",
  playNow: "PLAY NOW",
  greeting: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  },
  stats: {
    gamesAvailable: "Games available",
    unreadMessages: "Unread messages",
    friendRequests: "Friend requests",
  },
  games: {
    snake: "Snake",
    snakeDescription: "Classic arcade — eat & survive",
    ticTacToe: "Tic Tac Toe",
    ticTacToeDescription: "3×3 tactical duel",
    pong: "Pong",
    pongDescription: "Retro table tennis",
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
