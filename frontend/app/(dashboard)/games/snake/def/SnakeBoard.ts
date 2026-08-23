export interface ISnakePoint {
  x: number;
  y: number;
}

export interface IGameBoardProps {
  boardWidth: number;
  boardHeight: number;
  mySnake: ISnakePoint[];
  oppSnake: ISnakePoint[];
  food: ISnakePoint;
}
