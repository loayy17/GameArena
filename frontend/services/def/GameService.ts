import { SignalRServiceBase } from "../lib/SignalR";

import type { HubConnection } from "@microsoft/signalr";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInvite } from "@/domain/meta/INotification";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { TNullable } from "@/domain/type/TCommon";
import type { Handler } from "../lib/SignalR";

class GameService extends SignalRServiceBase {
  private _connectionReady: Promise<void>;
  private _resolveConnectionReady!: () => void;

  constructor() {
    super();
    this._connectionReady = new Promise((r) => {
      this._resolveConnectionReady = r;
    });
  }

  private async ensureConnection(): Promise<HubConnection> {
    if (this.connection) return this.connection;
    await Promise.race([
      this._connectionReady,
      new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Game connection not established")), 10000)),
    ]);
    if (!this.connection) throw new Error("Game connection not established");
    return this.connection;
  }

  protected registerHandlers(): void {
    this.addHandler("gameState", (data: unknown) => {
      this.subs.dispatch("game:state", data as IGameState);
    });

    this.addHandler("OpponentDisconnected", () => {
      this.subs.dispatch("game:disconnect");
    });

    this.addHandler("game:invite", (data: unknown) => {
      this.subs.dispatch("game:invite", data);
    });

    this.addHandler("playAgainRequest", (data: unknown) => {
      this.subs.dispatch("game:playAgainRequest", data);
    });

    this.addHandler("playAgainResponse", (data: unknown) => {
      this.subs.dispatch("game:playAgainResponse", data);
    });
  }

  private async invoke<T = void>(method: string, ...args: unknown[]): Promise<T> {
    const conn = await this.ensureConnection();
    return conn.invoke(method, ...args) as T;
  }

  async findMatch(gameKind: GamesKindEnum): Promise<void> {
    await this.invoke("FindMatch", gameKind);
  }

  async startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): Promise<void> {
    await this.invoke("StartGame", friendId, gameKind);
  }

  async inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void> {
    await this.invoke("InviteFriend", friendId, gameKind);
  }

  async inviteToRoom(friendId: string): Promise<void> {
    await this.invoke("InviteToRoom", friendId);
  }

  async leaveGame(): Promise<void> {
    await this.invoke("LeaveGame");
  }

  async requestPlayAgain(): Promise<void> {
    await this.invoke("RequestPlayAgain");
  }

  async respondPlayAgain(accept: boolean): Promise<void> {
    await this.invoke("RespondPlayAgain", accept);
  }

  async cancelSearch(): Promise<void> {
    await this.invoke("CancelSearch");
  }

  async sendAction(action: object): Promise<void> {
    await this.invoke("SendAction", action);
  }

  async acceptInvite(roomId: string): Promise<void> {
    await this.invoke("AcceptInvite", roomId);
  }

  async createLobby(gameKind: GamesKindEnum): Promise<void> {
    await this.invoke("CreateLobby", gameKind);
  }

  override setConnection(connection: HubConnection): void {
    super.setConnection(connection);
    this._resolveConnectionReady();
  }

  onGameState(handler: (state: IGameState) => void): () => void {
    return this.subscribe("game:state", handler as Handler);
  }

  onOpponentDisconnect(handler: () => void): () => void {
    return this.subscribe("game:disconnect", handler as Handler);
  }

  onGameInvite(handler: (invite: IGameInvite) => void): () => void {
    return this.subscribe("game:invite", handler as Handler);
  }

  onPlayAgainRequest(handler: (data: { requesterId: string; requesterUsername: string }) => void): () => void {
    return this.subscribe("game:playAgainRequest", handler as Handler);
  }

  onPlayAgainResponse(handler: (data: { accepted: boolean }) => void): () => void {
    return this.subscribe("game:playAgainResponse", handler as Handler);
  }
}

const gameService = new GameService();

export { gameService };
