import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameState } from "./IGameState";
import type { TNullable } from "@/domain/type/TCommon";

interface IGameContext {
  state: TNullable<IGameState>;
  isConnected: boolean;
  isSearching: boolean;
  searchError: TNullable<string>;
  opponentDisconnected: boolean;
  lastGameType: TNullable<GamesKindEnum>;
  pendingPlayAgainRequest: TNullable<{ requesterId: string; requesterUsername: string }>;
  requestedPlayAgain: boolean;
  playAgainTimedOut: boolean;
  findMatch(gameKind: GamesKindEnum): Promise<void>;
  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): Promise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void>;
  inviteToRoom(friendId: string): Promise<void>;
  leaveGame(): Promise<void>;
  requestPlayAgain(): Promise<void>;
  respondPlayAgain(accept: boolean): Promise<void>;
  resetGame(): Promise<void>;
  createLobby(gameKind: GamesKindEnum): Promise<void>;
  sendAction(action: object): void;
}

export type { IGameContext };
