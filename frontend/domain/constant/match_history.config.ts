import { Orbit, Puzzle, Swords } from "lucide-react";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { GameId } from "@/domain/constant/games";
import type { GGradient } from "@/component/common/tokens";

const matchGameMeta: Record<
  GamesKindEnum,
  {
    gameId: GameId;
    icon: typeof Orbit;
    gradient: GGradient;
    color: "success" | "primary" | "warning";
  }
> = {
  [GamesKindEnum.Snake]: {
    gameId: "snake",
    icon: Orbit,
    gradient: "game-green",
    color: "success",
  },
  [GamesKindEnum.TicTacToe]: {
    gameId: "ticTacToe",
    icon: Puzzle,
    gradient: "game-cyan",
    color: "primary",
  },
  [GamesKindEnum.PingPong]: {
    gameId: "pong",
    icon: Swords,
    gradient: "game-magenta",
    color: "warning",
  },
};

/** Replace with API data when backend is ready */
const mockMatchHistory: IMatchHistory[] = [
  {
    id: "1",
    game: GamesKindEnum.TicTacToe,
    opponentName: "ShadowX",
    result: MatchResultEnum.Win,
    playedAt: new Date(Date.now() - 1000 * 60 * 45),
    score: "3-1",
  },
  {
    id: "2",
    game: GamesKindEnum.Snake,
    opponentName: "NovaBlade",
    result: MatchResultEnum.Loss,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    score: "1280 pts",
  },
  {
    id: "3",
    game: GamesKindEnum.PingPong,
    opponentName: "CyberWolf",
    result: MatchResultEnum.Draw,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    score: "11-11",
  },
  {
    id: "4",
    game: GamesKindEnum.TicTacToe,
    opponentName: "PixelKing",
    result: MatchResultEnum.Win,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    score: "2-0",
  },
  {
    id: "5",
    game: GamesKindEnum.Snake,
    opponentName: "StormRider",
    result: MatchResultEnum.Win,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    score: "2100 pts",
  },
];

export { matchGameMeta, mockMatchHistory };
