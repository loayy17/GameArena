import type { IMatchHistory } from "@/domain/meta/IMatchHistory";

interface IMatchHistoryCardProps {
  match: IMatchHistory;
  gameName: string;
  resultLabel: string;
  playedAtLabel: string;
  versusLabel: string;
  compact?: boolean;
}

export type { IMatchHistoryCardProps };
