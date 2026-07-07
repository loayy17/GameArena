import { Orbit, Puzzle, Swords } from "lucide-react";
import type { GGradient } from "@/component/common/tokens";

type GameId = "snake" | "ticTacToe" | "pong";

const games: {
  id: GameId;
  path: string;
  icon: typeof Orbit;
  gradient: GGradient;
  color: "success" | "primary" | "warning";
}[] = [
  {
    id: "snake",
    path: "/snake",
    icon: Orbit,
    gradient: "game-green",
    color: "success",
  },
  {
    id: "ticTacToe",
    path: "/tic-tac-toe",
    icon: Puzzle,
    gradient: "game-cyan",
    color: "primary",
  },
  {
    id: "pong",
    path: "/pong",
    icon: Swords,
    gradient: "game-magenta",
    color: "warning",
  },
];

export { games, type GameId };
