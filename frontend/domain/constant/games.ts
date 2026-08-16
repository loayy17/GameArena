import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { LucideIcon } from "lucide-react";
import { Grid3X3, Volleyball, Worm, Hand } from "lucide-react";
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
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "tictactoe.name",
    descriptionKey: "tictactoe.description",
    instructionKey: "tictactoe.instruction",
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
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: true,
    nameKey: "pingpong.name",
    descriptionKey: "pingpong.description",
    instructionKey: "pingpong.instruction",
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
    player1Colors: { box: "border-success bg-success-bg", badge: "bg-success", turn: "text-success" },
    player2Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    needsInput: true,
    nameKey: "snake.name",
    descriptionKey: "snake.description",
    instructionKey: "snake.instruction",
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
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "rockpaperscissors.name",
    descriptionKey: "rockpaperscissors.description",
    instructionKey: "rockpaperscissors.instruction",
  },
  [GamesKindEnum.ConnectFour]: {
    id: "connectfour",
    type: GamesKindEnum.ConnectFour,
    icon: Grid3X3,
    path: "connect-four",
    tileGradient: "from-primary to-accent",
    animation: "/connect_four.json",
    symbol1: "🔴",
    symbol2: "🟡",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "connectfour.name",
    descriptionKey: "connectfour.description",
    instructionKey: "connectfour.instruction",
  },
};

export const GAMES_BY_TYPE = gameConfigs;

export const GamesList: IGameConfig[] = Object.values(gameConfigs);

export function getGameConfig(gameType: GamesKindEnum): IGameConfig {
  const config = gameConfigs[gameType];
  if (!config) throw new Error(`No game config found for game type: ${gameType}`);
  return config;
}

export function translateGameInfo(t: GameTranslations, gameType: GamesKindEnum): { name: string; description: string; instruction: string } {
  const config = getGameConfig(gameType);
  const lookup = (key: string): string => (t as unknown as Record<string, unknown>)[key] as string;
  return { name: lookup(config.nameKey), description: lookup(config.descriptionKey), instruction: lookup(config.instructionKey) };
}
