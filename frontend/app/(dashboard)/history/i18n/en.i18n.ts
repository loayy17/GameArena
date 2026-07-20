import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";

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
  columns: {
    game: "Game",
    opponent: "Opponent",
    result: "Result",
    date: "Date",
  },
  games: {
    [GamesKindEnum.Snake]: "Snake",
    [GamesKindEnum.TicTacToe]: "Tic Tac Toe",
    [GamesKindEnum.PingPong]: "Ping Pong",
    [GamesKindEnum.None]: "Unknown",
  },
  empty: {
    title: "No matches yet",
    description: "Your battle history will appear here once you finish your first game.",
    filtered: "No matches found for this filter.",
  },
};

type THistoryTranslation = typeof en;
export { en, type THistoryTranslation };
