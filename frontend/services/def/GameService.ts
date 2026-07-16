import type { HubConnection } from "@microsoft/signalr";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInvite } from "@/domain/meta/INotification";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { IGameService } from "../meta/IGameService";
import type { Handler } from "../lib/signalRUtils";
import { requireConnection } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

class GameService implements IGameService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();

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
  }

  // ── Invoke methods ──────────────────────────────────────────────────────

  async requestCurrentState(): Promise<IGameState | null> {
    return requireConnection(this.connection, "Game").invoke("GetCurrentState");
  }

  async findMatch(gameKind: GamesKindEnum): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("FindMatch", gameKind);
  }

  async startGame(friendId: string | null, gameKind: GamesKindEnum): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("StartGame", friendId, gameKind);
  }

  async inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("InviteFriend", friendId, gameKind);
  }

  async inviteToRoom(friendId: string): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("InviteToRoom", friendId);
  }

  async leaveGame(): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("LeaveGame");
  }

  async playAgain(): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("PlayAgain");
  }

  async cancelSearch(): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("CancelSearch");
  }

  async sendAction(action: object): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("SendAction", action);
  }

  async acceptInvite(roomId: string): Promise<void> {
    await requireConnection(this.connection, "Game").invoke("AcceptInvite", roomId);
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
}

const gameService = new GameService();

export { gameService };
