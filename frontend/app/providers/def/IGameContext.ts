import { TNullable } from "@/domain/type/TCommon";
import { IGameState } from "./IGameState";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IGameContext {
  state: TNullable<IGameState>;
  roomId: TNullable<string>;
  isSearching: boolean;
  isConnected: boolean;
  opponentDisconnected: boolean;
  isInitialSyncDone: boolean;
  lastGameType: GamesKindEnum | null;
  pendingPlayAgainRequest: { requesterId: string; requesterUsername: string } | null;
  requestedPlayAgain: boolean;
  findMatch(gameKind: GamesKindEnum): Promise<void>;
  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): Promise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void>;
  inviteToRoom(friendId: string): Promise<void>;
  leaveGame(): Promise<void>;
  requestPlayAgain(): Promise<void>;
  respondPlayAgain(accept: boolean): Promise<void>;
  resetGame(): Promise<void>;
  createLobby(gameKind: GamesKindEnum): Promise<void>;
  sendAction(action: object): Promise<void>;
}

export type { IGameContext };
