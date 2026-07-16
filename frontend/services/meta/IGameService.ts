import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInvite } from "@/domain/meta/INotification";
import type { IGameState } from "@/app/providers/def/IGameState";

interface IGameService {
  requestCurrentState(): Promise<IGameState | null>;
  findMatch(gameKind: GamesKindEnum): Promise<void>;
  startGame(friendId: string | null, gameKind: GamesKindEnum): Promise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void>;
  inviteToRoom(friendId: string): Promise<void>;
  leaveGame(): Promise<void>;
  requestPlayAgain(): Promise<void>;
  respondPlayAgain(accept: boolean): Promise<void>;
  cancelSearch(): Promise<void>;
  sendAction(action: object): Promise<void>;
  acceptInvite(roomId: string): Promise<void>;

  onGameState(handler: (state: IGameState) => void): () => void;
  onOpponentDisconnect(handler: () => void): () => void;
  onGameInvite(handler: (invite: IGameInvite) => void): () => void;
  onPlayAgainRequest(handler: (data: { requesterId: string; requesterUsername: string }) => void): () => void;
  onPlayAgainResponse(handler: (data: { accepted: boolean }) => void): () => void;
}

export type { IGameService };
