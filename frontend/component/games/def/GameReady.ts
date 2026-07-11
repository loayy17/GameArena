import type { IGameState } from "@/app/providers/def/IGameState";
import type { GameInfo } from "@/component/games/gameConfig";

interface GameReadyProps {
  state: IGameState;
  gameInfo: GameInfo;
  t: Record<string, any>;
  onStart: (opponentId: string) => void;
  onCancel: () => void;
}

export type { GameReadyProps };
