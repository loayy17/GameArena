import { useAuth } from "@/app/providers/AuthProvider";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { TNullable } from "@/domain/type/TCommon";

export function useGameStateView(state: TNullable<IGameState>) {
  const { user } = useAuth();
  const myPlayerId = user?.id;
  return {
    myPlayerId,
    isPlayer1: state?.player1Id === myPlayerId,
    isMyTurn: state ? state.currentTurnPlayerId === myPlayerId : false,
    isOver: state ? state.winnerPlayerId != null || state.isFinished === true : false,
  };
}
