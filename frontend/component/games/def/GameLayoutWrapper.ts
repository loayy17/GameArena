import type { ReactNode } from "react";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface GameLayoutWrapperProps {
  children: ReactNode;
  gameType: GamesKindEnum;
}

export type { GameLayoutWrapperProps };
