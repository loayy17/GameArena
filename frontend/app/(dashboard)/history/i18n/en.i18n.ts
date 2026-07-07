const en = {
  title: "Match History",
  subtitle: "Review your past battles, track wins, and learn from every duel.",
  badge: "Battle Log",
  versus: "vs",
  filters: {
    all: "All",
    win: "Wins",
    loss: "Losses",
    draw: "Draws",
  },
  summary: {
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
  },
  results: {
    win: "Win",
    loss: "Loss",
    draw: "Draw",
  },
  games: {
    snake: "Snake",
    ticTacToe: "Tic Tac Toe",
    pong: "Pong",
  },
  empty: {
    title: "No matches yet",
    description: "Your battle history will appear here once you finish your first game.",
    filtered: "No matches found for this filter.",
  },
};

type THistoryTranslation = typeof en;
export { en, type THistoryTranslation };
