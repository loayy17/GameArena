import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

const fr = {
  title: "Historique des matchs",
  subtitle: "Revoyez vos batailles passées, suivez vos victoires et apprenez de chaque duel.",
  badge: "Journal de bataille",
  versus: "vs",
  filters: {
    all: "Tous",
    win: "Victoires",
    loss: "Défaites",
    draw: "Nuls"
  },
  summary: {
    wins: "Victoires",
    losses: "Défaites",
    draws: "Nuls"
  },
  results: {
    win: "Victoire",
    loss: "Défaite",
    draw: "Nul"
  },
  games: {
    [GamesKindEnum.Snake]: "Snake",
    [GamesKindEnum.TicTacToe]: "Tic Tac Toe",
    [GamesKindEnum.PingPong]: "Ping Pong",
    [GamesKindEnum.RockPaperScissors]: "Rock Paper Scissors",
    [GamesKindEnum.ConnectFour]: "Connect Four"},
  empty: {
    title: "Aucun match pour l'instant",
    description: "Votre historique de batailles apparaîtra ici une fois votre première partie terminée.",
    filtered: "Aucun match trouvé pour ce filtre."
  },
  error: {
    title: "Impossible de charger l'historique"
  }
}
;

export { fr };