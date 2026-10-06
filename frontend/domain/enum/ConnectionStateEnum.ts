export enum ConnectionState {
    Disconnected = "disconnected",
    Connecting = "connecting",
    Connected = "connected",
    Reconnecting = "reconnecting",
}

export interface HubConnectionStates {
    game: ConnectionState;
    social: ConnectionState;
}
