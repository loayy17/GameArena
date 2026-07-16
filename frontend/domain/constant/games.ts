import { Grid3X3, Volleyball, Worm } from "lucide-react";
import { GamesKindEnum } from "../enum/GamesKindEnum";

const GamesList = [
  {
    name: "ticTacToe",
    description: "ticTacToeDesc",
    type: GamesKindEnum.TicTacToe,
    icon: Grid3X3,
    path: "tic-tac-toe",
    gradient: "text-primary",
    animation: "/tic_tac_toe_1.json",
  },
  {
    name: "snake",
    description: "snakeDesc",
    type: GamesKindEnum.Snake,
    path: "snake",
    icon: Worm,
    gradient: "text-success",
    animation: "/Snake.json",
  },
  {
    name: "pong",
    description: "pongDesc",
    type: GamesKindEnum.PingPong,
    path: "ping-pong",
    icon: Volleyball,
    gradient: "text-success",
    animation: "/ping-pong.json",
  },
] as const;
export { GamesList };
