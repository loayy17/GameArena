import type { ReactNode } from "react";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { GameInfo } from "@/component/games/gameConfig";

interface GameActiveProps {
  state: IGameState;
  gameInfo: GameInfo;
  t: Record<string, any>;
  opponentDisconnected: boolean;
  children: ReactNode;
  onPlayAgain: () => void;
  onLobby: () => void;
  onLeave: () => void;
}

export type { GameActiveProps };
