import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { PlayerColors } from "@/component/games/common/def/PlayerCard";

interface GameInfo {
  name: string;
  description: string;
  symbol1: string;
  symbol2: string;
  player1Colors: PlayerColors;
  player2Colors: PlayerColors;
}

const gameConfigs: Partial<Record<GamesKindEnum, GameInfo>> = {
  [GamesKindEnum.TicTacToe]: {
    name: "tictactoe.name",
    description: "tictactoe.description",
    symbol1: "X",
    symbol2: "O",
    player1Colors: {
      box: "border-accent bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
    player2Colors: {
      box: "border-warning bg-warning-bg",
      badge: "bg-warning",
      turn: "text-warning",
    },
  },
  [GamesKindEnum.PingPong]: {
    name: "pingpong.name",
    description: "pingpong.description",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: {
      box: "border-accent bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
    player2Colors: {
      box: "border-warning bg-warning-bg",
      badge: "bg-warning",
      turn: "text-warning",
    },
  },
  [GamesKindEnum.Snake]: {
    name: "snake.name",
    description: "snake.description",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: {
      box: "border-neon-green bg-success-bg",
      badge: "bg-success",
      turn: "text-success",
    },
    player2Colors: {
      box: "border-neon-magenta bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
  },
};

function getGameConfig(gameType: GamesKindEnum): GameInfo {
  const config = gameConfigs[gameType];
  if (!config) throw new Error(`No game config found for game type: ${gameType}`);
  return config;
}

export { getGameConfig, type GameInfo };
