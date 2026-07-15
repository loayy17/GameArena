import { friendRepository } from "@/repositories/def/FriendRepository";
import type { HubConnection } from "@microsoft/signalr";
import type { TPromise } from "@/domain/type/TCommon";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendService } from "../meta/IFriendService";
import type { IFriendRepository } from "@/repositories/meta/IFriendRepository";
import type { Handler } from "../lib/signalRUtils";
import { requireConnection } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

const buildFullName = (first: string | null | undefined, last: string | null | undefined): string =>
  `${first ?? ""} ${last ?? ""}`.trim();

const toFullNameUser = (u: IUserSummary): IUserSummary => ({
  ...u,
  fullName: buildFullName(u.firstName, u.lastName) || u.userName || u.id,
});

class FriendService implements IFriendService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();

  constructor(private repo: IFriendRepository) {}

  handleReconnect(): void {
    this.reconnectHandlers.forEach((h) => { try { h(); } catch { /* isolated */ } });
  }

  onReconnect(handler: () => void): () => void {
    this.reconnectHandlers.add(handler);
    return () => { this.reconnectHandlers.delete(handler); };
  }

  // ── Connection setup (called once by ConnectionProvider) ──────────────

  setConnection(connection: HubConnection): void {
    if (this.connection) {
      this.connection.off("social:friends");
      this.connection.off("social:requests");
      this.connection.off("social:blocked");
      this.connection.off("friend:online");
      this.connection.off("friend:offline");
      this.connection.off("friend:ingame");
    }
    this.connection = connection;

    this.connection.on("social:friends", (data: unknown) => {
      const list = (data as IUserSummary[]).map(toFullNameUser).sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));
      this.subs.dispatch("social:friends", list);
    });

    this.connection.on("social:requests", (data: unknown) => {
      this.subs.dispatch("social:requests", data);
    });

    this.connection.on("social:blocked", (data: unknown) => {
      this.subs.dispatch("social:blocked", (data as IUserSummary[]).map(toFullNameUser));
    });

    this.connection.on("friend:online", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, "online");
    });

    this.connection.on("friend:offline", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, "offline");
    });

    this.connection.on("friend:ingame", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, "ingame");
    });
  }

  // ── REST API ─────────────────────────────────────────────────────────

  sendFriendRequest(friendId: string): TPromise<void> {
    return this.repo.sendFriendRequest(friendId);
  }

  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]> {
    return this.repo.getReceivedFriendRequests();
  }

  getSentFriendRequests(): TPromise<IFriendRequestSent[]> {
    return this.repo.getSentFriendRequests();
  }

  async getFriends(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.repo.getFriends(data);
    if (result.data) result.data = result.data.map(toFullNameUser);
    return result;
  }

  acceptFriendRequest(senderId: string): TPromise<void> {
    return this.repo.acceptFriendRequest(senderId);
  }

  rejectFriendRequest(senderId: string): TPromise<void> {
    return this.repo.rejectFriendRequest(senderId);
  }

  cancelFriendRequest(receiverId: string): TPromise<void> {
    return this.repo.cancelFriendRequest(receiverId);
  }

  removeFriend(friendId: string): TPromise<void> {
    return this.repo.removeFriend(friendId);
  }

  blockUser(blockedId: string): TPromise<void> {
    return this.repo.blockUser(blockedId);
  }

  unblockUser(blockedId: string): TPromise<void> {
    return this.repo.unblockUser(blockedId);
  }

  getBlockedUsers(): TPromise<IUserSummary[]> {
    return this.repo.getBlockedUsers();
  }

  // ── SignalR subscriptions ────────────────────────────────────────────

  onFriendListUpdate(handler: (friends: IUserSummary[]) => void): () => void {
    return this.subs.subscribe("social:friends", handler as Handler);
  }

  onFriendRequestUpdate(handler: (data: { received: IFriendRequestReceived[]; sent: IFriendRequestSent[] }) => void): () => void {
    return this.subs.subscribe("social:requests", handler as Handler);
  }

  onBlockedUsersUpdate(handler: (blocked: IUserSummary[]) => void): () => void {
    return this.subs.subscribe("social:blocked", handler as Handler);
  }

  onFriendStatusChange(handler: (userId: string, status: "online" | "offline" | "ingame") => void): () => void {
    return this.subs.subscribe("friend:status", handler as Handler);
  }

  // ── SignalR invocations ────────────────────────────────────────────────

  async invokeSocialData(): Promise<void> {
    await requireConnection(this.connection, "Social").invoke("RequestSocialData");
  }

  async invokeFriends(): Promise<void> {
    await requireConnection(this.connection, "Social").invoke("RequestFriends");
  }

  async invokeFriendRequests(): Promise<void> {
    await requireConnection(this.connection, "Social").invoke("RequestFriendRequests");
  }

  async invokeBlocked(): Promise<void> {
    await requireConnection(this.connection, "Social").invoke("RequestBlocked");
  }
}

const friendService = new FriendService(friendRepository);

export { friendService };
