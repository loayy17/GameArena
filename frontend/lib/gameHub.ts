import * as signalR from "@microsoft/signalr";

const HUB_URL = "https://gently-squeamish-chaffing.ngrok-free.dev/";

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export interface GameState {
    roomId: string;
    board: Board;
    turn: Player;
    players: { X: string; O: string };
    winner: Player | null;
    draw: boolean;
}

export interface GameHubCallbacks {
    onPlayerJoined: (players: { X: string; O: string }) => void;
    onMoveMade: (state: GameState) => void;
    onGameOver: (winner: Player | null, draw: boolean) => void;
    onError: (msg: string) => void;
    onOpponentDisconnected: () => void;
}

export function createGameHub(callbacks: GameHubCallbacks) {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

    connection.on("PlayerJoined", (players) => callbacks.onPlayerJoined(players));
    connection.on("MoveMade", (state) => callbacks.onMoveMade(state));
    connection.on("GameOver", (winner, draw) => callbacks.onGameOver(winner, draw));
    connection.on("Error", (msg) => callbacks.onError(msg));
    connection.on("OpponentDisconnected", () => callbacks.onOpponentDisconnected());

    return connection;
}

export async function createRoom(
    connection: signalR.HubConnection
): Promise<string> {
    return connection.invoke<string>("CreateRoom");
}

export async function joinRoom(
    connection: signalR.HubConnection,
    roomId: string
): Promise<void> {
    await connection.invoke("JoinRoom", roomId);
}

export async function makeMove(
    connection: signalR.HubConnection,
    roomId: string,
    position: number
): Promise<void> {
    await connection.invoke("MakeMove", roomId, position);
}

export async function leaveRoom(
    connection: signalR.HubConnection,
    roomId: string
): Promise<void> {
    await connection.invoke("LeaveRoom", roomId);
}
