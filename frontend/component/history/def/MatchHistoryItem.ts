import type { IMatchHistory } from "@/domain/meta/IMatchHistory";

interface MatchHistoryItemProps {
  match: IMatchHistory;
  locale: string;
  winLabel: string;
  lossLabel: string;
  drawLabel: string;
  versusLabel: string;
  gameLabel: string;
}

export type { MatchHistoryItemProps };
