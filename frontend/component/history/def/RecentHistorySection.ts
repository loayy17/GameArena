import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TNullable } from "@/domain/type/TCommon";

interface IRecentHistorySectionProps {
  title: string;
  viewAll: string;
  emptyTitle: string;
  emptyDescription: string;
  matches: IMatchHistory[];
  loading: boolean;
  error: TNullable<string>;
  onRetry: () => void;
  limit?: number;
}

export type { IRecentHistorySectionProps };
