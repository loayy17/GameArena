import { Grid3X3, Hand, Volleyball, Worm } from "lucide-react";

import { CellEnum } from "@/domain/enum/CellEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

import type { LucideIcon } from "lucide-react";
import type { THashMap } from "@/domain/type/TCommon";
import type { IPlayerCardColors } from "@/component/games/def/GameUI";
import type { GameTranslations } from "@/component/i18n/Game/en.i18n";

export interface IGameConfig {
  id: string;
  type: GamesKindEnum;
  icon: LucideIcon;
  path: string;
  tileGradient: string;
  animation: string;
  symbol1: string;
  symbol2: string;
  player1Colors: IPlayerCardColors;
  player2Colors: IPlayerCardColors;
  needsInput: boolean;
  nameKey: string;
  descriptionKey: string;
  instructionKey: string;
  guideKey: string;
}

const gameConfigs: Record<GamesKindEnum, IGameConfig> = {
  [GamesKindEnum.TicTacToe]: {
    id: "tictactoe",
    type: GamesKindEnum.TicTacToe,
    icon: Grid3X3,
    path: "tic-tac-toe",
    tileGradient: "from-primary to-accent",
    animation: "/tic_tac_toe_1.json",
    symbol1: "X",
    symbol2: "O",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-muted", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "tictactoe.name",
    descriptionKey: "tictactoe.description",
    instructionKey: "tictactoe.instruction",
    guideKey: "tictactoe.guide",
  },
  [GamesKindEnum.PingPong]: {
    id: "pingpong",
    type: GamesKindEnum.PingPong,
    icon: Volleyball,
    path: "ping-pong",
    tileGradient: "from-success to-secondary",
    animation: "/ping-pong.json",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-muted", badge: "bg-warning", turn: "text-warning" },
    needsInput: true,
    nameKey: "pingpong.name",
    descriptionKey: "pingpong.description",
    instructionKey: "pingpong.instruction",
    guideKey: "pingpong.guide",
  },
  [GamesKindEnum.Snake]: {
    id: "snake",
    type: GamesKindEnum.Snake,
    icon: Worm,
    path: "snake",
    tileGradient: "from-success to-secondary",
    animation: "/Snake.json",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: { box: "border-success bg-success-muted", badge: "bg-success", turn: "text-success" },
    player2Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    needsInput: true,
    nameKey: "snake.name",
    descriptionKey: "snake.description",
    instructionKey: "snake.instruction",
    guideKey: "snake.guide",
  },
  [GamesKindEnum.RockPaperScissors]: {
    id: "rockpaperscissors",
    type: GamesKindEnum.RockPaperScissors,
    icon: Hand,
    path: "rock-paper-scissors",
    tileGradient: "from-primary to-accent",
    animation: "/rock_paper_scissors.json",
    symbol1: "✊",
    symbol2: "✌️",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-muted", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "rockpaperscissors.name",
    descriptionKey: "rockpaperscissors.description",
    instructionKey: "rockpaperscissors.instruction",
    guideKey: "rockpaperscissors.guide",
  },
  [GamesKindEnum.ConnectFour]: {
    id: "connectfour",
    type: GamesKindEnum.ConnectFour,
    icon: Grid3X3,
    path: "connect-four",
    tileGradient: "from-primary to-accent",
    animation: "/connect_four.json",
    symbol1: "",
    symbol2: "",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-muted", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "connectfour.name",
    descriptionKey: "connectfour.description",
    instructionKey: "connectfour.instruction",
    guideKey: "connectfour.guide",
  },
};

export const GAMES_BY_TYPE = gameConfigs;

export const GamesList: IGameConfig[] = Object.values(gameConfigs);

export function getGameConfig(gameType: GamesKindEnum): IGameConfig {
  const config = gameConfigs[gameType];
  if (!config) throw new Error(`No game config found for game type: ${gameType}`);
  return config;
}

export function translateGameInfo(
  t: GameTranslations & Record<string, unknown>,
  gameType: GamesKindEnum,
): { name: string; description: string; instruction: string; guide: string } {
  const config = getGameConfig(gameType);

  const lookup = (key: string): string => {
    const value: unknown = t[key];
    return typeof value === "string" ? value : key;
  };
  return {
    name: lookup(config.nameKey),
    description: lookup(config.descriptionKey),
    instruction: lookup(config.instructionKey),
    guide: lookup(config.guideKey),
  };
}

export const BOARD_EMPTY = ".";
export const PLAYER_X = "X";
export const PLAYER_O = "O";

export function dropRow(column: number[]): number {
  for (let row = column.length - 1; row >= 0; row--) {
    if (column[row] === CellEnum.None) return row;
  }
  return -1;
}

export const INPUT_THROTTLE_MS = {
  PING_PONG: 16,
  SNAKE: 60,
} as const;

export const SWIPE_THRESHOLD_PX = 20;

export const PLAY_AGAIN_TIMEOUT_MS = 30000;

export const RPS_CHOICES = ["Rock", "Paper", "Scissors"] as const;

export const RPS_CHOICE_EMOJI: THashMap<string, string> = {
  Rock: "✊",
  Paper: "✋",
  Scissors: "✌️",
};

export const GameActionTypes = {
  MOVE_PADDLE: "MOVE_PADDLE",
  SET_PADDLE: "SET_PADDLE",
  CHANGE_DIRECTION: "CHANGE_DIRECTION",
  MAKE_MOVE: "MAKE_MOVE",
  PLACE: "place",
} as const;

export const DirectionValues = {
  UP: "UP",
  DOWN: "DOWN",
} as const;

export type TGameAction =
  | { type: typeof GameActionTypes.MOVE_PADDLE; direction: "UP" | "DOWN" }
  | { type: typeof GameActionTypes.SET_PADDLE; y: number }
  | { type: typeof GameActionTypes.CHANGE_DIRECTION; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" }
  | { type: typeof GameActionTypes.MAKE_MOVE; choice?: string; cell?: number }
  | { type: typeof GameActionTypes.PLACE; col: number };

export const DIRECTIONS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", string[]> = {
  UP: ["ArrowUp", "w", "W"],
  DOWN: ["ArrowDown", "s", "S"],
  LEFT: ["ArrowLeft", "a", "A"],
  RIGHT: ["ArrowRight", "d", "D"],
};

export const PADDLE_KEYS = {
  UP: new Set(DIRECTIONS.UP),
  DOWN: new Set(DIRECTIONS.DOWN),
} as const;
