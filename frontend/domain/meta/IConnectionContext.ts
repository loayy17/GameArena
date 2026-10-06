import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "../type/TCommon";
import type { HubConnectionStates } from "../enum/ConnectionStateEnum";

interface IConnectionContext {
    gameConnection: TNullable<HubConnection>;
    socialConnection: TNullable<HubConnection>;
    connectionStates: HubConnectionStates;
    isGameConnected: boolean;
    isSocialConnected: boolean;
    isGameConnecting: boolean;
    isSocialConnecting: boolean;
    isAllConnected: boolean;
    socialReconnectKey: number;
    stopConnections: () => Promise<void>;
}

export type { IConnectionContext };
