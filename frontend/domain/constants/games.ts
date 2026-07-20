import { GamesKindEnum } from '../enum/GamesKindEnum';
import { LucideIcon } from 'lucide-react';
import { Grid3X3, Volleyball, Worm } from 'lucide-react';

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  type: GamesKindEnum;
  icon: LucideIcon;
  path: string;
  gradient: string;
  animation: string;
  gradientClass: string;
}

export const GAMES_CONFIG: readonly GameConfig[] = [
  {
    id: 'ticTacToe',
    name: 'ticTacToe',
    description: 'tictactoeDesc',
    type: GamesKindEnum.TicTacToe,
    icon: Grid3X3,
    path: 'tic-tac-toe',
    gradient: 'text-primary',
    animation: '/tic_tac_toe_1.json',
    gradientClass: 'from-primary to-accent',
  },
  {
    id: 'snake',
    name: 'snake',
    description: 'snakeDesc',
    type: GamesKindEnum.Snake,
    icon: Worm,
    path: 'snake',
    gradient: 'text-success',
    animation: '/Snake.json',
    gradientClass: 'from-success to-secondary',
  },
  {
    id: 'pong',
    name: 'pong',
    description: 'pongDesc',
    type: GamesKindEnum.PingPong,
    icon: Volleyball,
    path: 'ping-pong',
    gradient: 'text-success',
    animation: '/ping-pong.json',
    gradientClass: 'from-success to-secondary',
  },
] as const;

export const GAMES_MAP = Object.fromEntries(
  GAMES_CONFIG.map((g) => [g.id, g])
) as Record<string, GameConfig>;

export const GAMES_BY_TYPE = Object.fromEntries(
  GAMES_CONFIG.map((g) => [g.type, g])
) as Record<GamesKindEnum, GameConfig>;

export const GAME_DEFAULTS = {
  MIN_PLAYERS: 1,
  MAX_PLAYERS: 2,
  TIMEOUT: 30000,
  RECONNECT_ATTEMPTS: 3,
} as const;