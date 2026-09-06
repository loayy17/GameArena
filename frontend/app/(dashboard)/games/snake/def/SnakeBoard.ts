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

export interface ISnakeLayerProps {
  snake: ISnakePoint[];
  bodyClass: string;
  headClass: string;
  boardWidth: number;
  boardHeight: number;
}

export interface ISnakeSegmentProps {
  point: ISnakePoint;
  boardWidth: number;
  boardHeight: number;
  className: string;
  scale: number;
}
