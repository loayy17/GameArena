import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IGameVisualGuideProps {
  gameType: GamesKindEnum;
  guide: string;
}

export type { IGameVisualGuideProps };
