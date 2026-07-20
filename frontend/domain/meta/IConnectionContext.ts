import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "../type/TCommon";

interface IConnectionContext {
  chatConnection: TNullable<HubConnection>;
  gameConnection: TNullable<HubConnection>;
  socialConnection: TNullable<HubConnection>;
  isChatConnected: boolean;
  isGameConnected: boolean;
  isSocialConnected: boolean;
  socialReconnectKey: number;
  stopConnections: () => Promise<void>;
}

export type { IConnectionContext };
