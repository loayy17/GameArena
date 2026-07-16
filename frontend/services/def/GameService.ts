import type { HubConnection } from "@microsoft/signalr";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInvite } from "@/domain/meta/INotification";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { IGameService } from "../meta/IGameService";
import type { Handler } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

class GameService implements IGameService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();
  private _connectionReady: Promise<void>;
  private _resolveConnectionReady!: () => void;

  constructor() {
    this._connectionReady = new Promise((r) => { this._resolveConnectionReady = r; });
  }

  private async ensureConnection(): Promise<HubConnection> {
    if (this.connection) return this.connection;
    await Promise.race([
      this._connectionReady,
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Game connection not established")), 10000)
      ),
    ]);
    if (!this.connection) throw new Error("Game connection not established");
    return this.connection;
  }

  handleReconnect(): void {
    this.requestCurrentState().catch(() => {});
    this.reconnectHandlers.forEach((h) => { try { h(); } catch { /* isolated */ } });
  }

  onReconnect(handler: () => void): () => void {
    this.reconnectHandlers.add(handler);
    return () => { this.reconnectHandlers.delete(handler); };
  }

  setConnection(connection: HubConnection): void {
    if (this.connection) {
      this.connection.off("gameState");
      this.connection.off("OpponentDisconnected");
      this.connection.off("game:invite");
      this.connection.off("playAgainRequest");
      this.connection.off("playAgainResponse");
    }
    this.connection = connection;

    this.connection.on("gameState", (data: unknown) => {
      this.subs.dispatch("game:state", data);
    });

    this.connection.on("OpponentDisconnected", () => {
      this.subs.dispatch("game:disconnect");
    });

    this.connection.on("game:invite", (data: unknown) => {
      this.subs.dispatch("game:invite", data);
    });

    this.connection.on("playAgainRequest", (data: unknown) => {
      this.subs.dispatch("game:playAgainRequest", data);
    });

    this.connection.on("playAgainResponse", (data: unknown) => {
      this.subs.dispatch("game:playAgainResponse", data);
    });

    this._resolveConnectionReady();
  }

  // ── Invoke methods ──────────────────────────────────────────────────────

  private async invoke<T = void>(method: string, ...args: unknown[]): Promise<T> {
    const conn = await this.ensureConnection();
    return conn.invoke(method, ...args);
  }

  async requestCurrentState(): Promise<IGameState | null> {
    return this.invoke<IGameState | null>("GetCurrentState");
  }

  async findMatch(gameKind: GamesKindEnum): Promise<void> {
    await this.invoke("FindMatch", gameKind);
  }

  async startGame(friendId: string | null, gameKind: GamesKindEnum): Promise<void> {
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

  // ── Subscriptions ────────────────────────────────────────────────────────

  onGameState(handler: (state: IGameState) => void): () => void {
    return this.subs.subscribe("game:state", handler as Handler);
  }

  onOpponentDisconnect(handler: () => void): () => void {
    return this.subs.subscribe("game:disconnect", handler as Handler);
  }

  onGameInvite(handler: (invite: IGameInvite) => void): () => void {
    return this.subs.subscribe("game:invite", handler as Handler);
  }

  onPlayAgainRequest(handler: (data: { requesterId: string; requesterUsername: string }) => void): () => void {
    return this.subs.subscribe("game:playAgainRequest", handler as Handler);
  }

  onPlayAgainResponse(handler: (data: { accepted: boolean }) => void): () => void {
    return this.subs.subscribe("game:playAgainResponse", handler as Handler);
  }
}

const gameService = new GameService();

export { gameService };
