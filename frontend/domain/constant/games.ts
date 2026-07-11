import { CircleX, Volleyball, Worm } from "lucide-react";
import { GamesKindEnum } from "../enum/GamesKindEnum";

const GamesList = [
  {
    name: "ticTacToe",
    description: "ticTacToeDesc",
    type: GamesKindEnum.TicTacToe,
    icon: CircleX,
    path: "tic-tac-toe",
    gradient: "text-primary",
  },
  {
    name: "snake",
    description: "snakeDesc",
    type: GamesKindEnum.Snake,
    path: "snake",
    icon: Worm,
    gradient: "text-success",
  },
  {
    name: "pong",
    description: "pongDesc",
    type: GamesKindEnum.PingPong,
    path: "ping-pong",
    icon: Volleyball,
    gradient: "text-success",
  },
] as const;
export { GamesList };
