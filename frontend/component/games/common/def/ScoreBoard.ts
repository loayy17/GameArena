interface IScoreSide {
  score: number;
  label: string;
  colorClass?: string;
}

interface IScoreBoardProps {
  left: IScoreSide;
  right: IScoreSide;
  winScore?: number;
  variant?: "vs" | "compact";
  className?: string;
}

export type { IScoreBoardProps, IScoreSide };
