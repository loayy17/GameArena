import type { IGameState } from "@/app/providers/def/IGameState";
import type { GameInfo } from "@/component/games/gameConfig";

interface GameLobbyProps {
  state: IGameState;
  gameInfo: GameInfo;
  t: Record<string, any>;
  onStartVsAI: () => void;
  onInviteFriend: (friendId: string) => void;
  onCancel: () => void;
}

export type { GameLobbyProps };
