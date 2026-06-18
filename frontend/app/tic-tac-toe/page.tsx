"use client";
import { RotateCcw, X as XIcon, Circle, Copy, Check, LogOut, ArrowLeft, Gamepad2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    createGameHub,
    createRoom,
    joinRoom,
    makeMove,
    leaveRoom,
    type Board,
    type Player,
    type Cell,
    type GameState,
} from "@/lib/gameHub";

const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Board): { winner: Player; line: number[] } | null {
    for (const combo of WIN_COMBOS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a]!, line: combo };
        }
    }
    return null;
}

function isDraw(board: Board): boolean {
    return board.every((c) => c !== null);
}

function localHandleClick(
    i: number,
    board: Board,
    turn: Player,
    result: { winner: Player; line: number[] } | null,
    draw: boolean,
    setBoard: (b: Board) => void,
    setTurn: (t: Player) => void,
    setResult: (r: { winner: Player; line: number[] } | null) => void,
    setDraw: (d: boolean) => void,
    setMoves: (fn: (prev: number[]) => number[]) => void,
) {
    if (board[i] || result || draw) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setMoves((prev) => [...prev, i]);

    const w = checkWinner(next);
    if (w) { setResult(w); return; }
    if (isDraw(next)) { setDraw(true); return; }
    setTurn(turn === "X" ? "O" : "X");
}

export default function TicTacToe() {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [turn, setTurn] = useState<Player>("X");
    const [result, setResult] = useState<{ winner: Player; line: number[] } | null>(null);
    const [draw, setDraw] = useState(false);
    const [moves, setMoves] = useState<number[]>([]);
    const [scores, setScores] = useState({ X: 0, O: 0 });

    // SignalR state
    const [online, setOnline] = useState(false);
    const [connected, setConnected] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [joinInput, setJoinInput] = useState("");
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);
    const [opponent, setOpponent] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const connRef = useRef<ReturnType<typeof createGameHub> | null>(null);
    const roomRef = useRef<string | null>(null);

    const resetLocal = useCallback(() => {
        setBoard(Array(9).fill(null));
        setTurn("X");
        setResult(null);
        setDraw(false);
        setMoves([]);
    }, []);

    const resetGame = useCallback(() => {
        if (online) {
            setScores({ X: 0, O: 0 });
        }
        resetLocal();
    }, [online, resetLocal]);

    // Connect to SignalR hub
    const startConnection = useCallback(async (room: string) => {
        const conn = createGameHub({
            onPlayerJoined: (players) => {
                setOpponent(players.X === myPlayer ? players.O : players.X);
                setStatusMsg("Opponent joined! Game starting...");
            },
            onMoveMade: (state: GameState) => {
                setBoard(state.board);
                setTurn(state.turn);
                const w = checkWinner(state.board);
                if (w) {
                    setResult(w);
                    setScores((s) => ({ ...s, [w.winner]: s[w.winner] + 1 }));
                } else if (isDraw(state.board)) {
                    setDraw(true);
                }
            },
            onGameOver: (winner, isDrawGame) => {
                if (winner) {
                    setResult({ winner, line: [] });
                    setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
                } else {
                    setDraw(isDrawGame);
                }
            },
            onError: (msg) => setStatusMsg(`Error: ${msg}`),
            onOpponentDisconnected: () => {
                setStatusMsg("Opponent disconnected");
                setOpponent(null);
            },
        });

        conn.onclose(() => { setConnected(false); });

        try {
            await conn.start();
            setConnected(true);
            await joinRoom(conn, room);
            connRef.current = conn;
            roomRef.current = room;
        } catch {
            setStatusMsg("Failed to connect to game server");
        }
    }, [myPlayer]);

    const handleCreateRoom = async () => {
        setOnline(true);
        setMyPlayer("X");
        setStatusMsg("Creating room...");
        const conn = createGameHub({
            onPlayerJoined: (players) => {
                setOpponent(players.X === "X" ? players.O : players.X);
                setStatusMsg("Opponent joined!");
            },
            onMoveMade: (state: GameState) => {
                setBoard(state.board);
                setTurn(state.turn);
                const w = checkWinner(state.board);
                if (w) { setResult(w); setScores((s) => ({ ...s, [w.winner]: s[w.winner] + 1 })); }
                else if (isDraw(state.board)) { setDraw(true); }
            },
            onGameOver: (winner, isDrawGame) => {
                if (winner) { setResult({ winner, line: [] }); setScores((s) => ({ ...s, [winner]: s[winner] + 1 })); }
                else { setDraw(isDrawGame); }
            },
            onError: (msg) => setStatusMsg(`Error: ${msg}`),
            onOpponentDisconnected: () => { setStatusMsg("Opponent disconnected"); setOpponent(null); },
        });

        conn.onclose(() => setConnected(false));

        try {
            await conn.start();
            setConnected(true);
            const id = await createRoom(conn);
            setRoomId(id);
            roomRef.current = id;
            connRef.current = conn;
            setStatusMsg("Room created! Share the code with your opponent.");
        } catch {
            setStatusMsg("Failed to create room");
        }
    };

    const handleJoinRoom = async () => {
        if (!joinInput.trim()) return;
        setOnline(true);
        setMyPlayer("O");
        setStatusMsg("Joining room...");
        await startConnection(joinInput.trim());
    };

    const handleLeave = async () => {
        if (connRef.current && roomRef.current) {
            await leaveRoom(connRef.current, roomRef.current);
            await connRef.current.stop();
        }
        connRef.current = null;
        roomRef.current = null;
        setOnline(false);
        setConnected(false);
        setRoomId(null);
        setOpponent(null);
        setMyPlayer(null);
        setStatusMsg("");
        resetLocal();
    };

    const handleCellClick = (i: number) => {
        if (online) {
            if (!connRef.current || !roomRef.current || !myPlayer || turn !== myPlayer || result || draw || board[i]) return;
            makeMove(connRef.current, roomRef.current, i);
        } else {
            localHandleClick(i, board, turn, result, draw, setBoard, setTurn, setResult, setDraw, setMoves);
        }
    };

    const copyRoomCode = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ─────────────────────────────────────────────────────────
    // Lobby screen
    // ─────────────────────────────────────────────────────────
    if (!online) {
        return (
            <div className="h-screen w-screen bg-bg-dark text-text overflow-hidden font-sans antialiased flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#7c5cfc15,_transparent_60%)]" />
                <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-neon-purple/5 rounded-full blur-[120px] animate-glow" />

                <div className="relative z-10 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_#7c5cfc]">
                        <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-neon-cyan via-primary to-neon-purple bg-clip-text text-transparent">Tic Tac Toe</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleCreateRoom}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-neon-purple text-white font-bold hover:shadow-[0_0_30px_-5px_#7c5cfc] transition-all duration-300 cursor-pointer">
                            Create Room
                        </button>
                        <div className="flex items-center gap-2">
                            <input value={joinInput} onChange={(e) => setJoinInput(e.target.value)}
                                placeholder="Room code"
                                className="w-32 px-4 py-3 rounded-xl border border-border/60 bg-bg-card/80 text-text text-sm outline-none focus:border-primary transition-colors"
                            />
                            <button onClick={handleJoinRoom}
                                className="px-6 py-3 rounded-xl border border-primary/40 text-primary font-bold hover:bg-primary/10 transition-all duration-300 cursor-pointer">
                                Join
                            </button>
                        </div>
                    </div>

                    <p className="text-text-secondary/50 text-xs mt-8">— or play locally —</p>
                    <button onClick={() => { setOnline(false); resetLocal(); }}
                        className="mt-3 px-8 py-3 rounded-xl bg-bg-card/80 border border-border/60 text-text-secondary font-medium hover:border-primary/40 hover:text-text transition-all duration-200 cursor-pointer">
                        Local Match
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────
    // Game screen
    // ─────────────────────────────────────────────────────────
    return (
        <div className="h-screen w-screen bg-bg-dark text-text overflow-hidden font-sans antialiased flex flex-col relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#7c5cfc10,_transparent_60%)]" />
            <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[150px] animate-pulse" />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40">
                <button onClick={handleLeave}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                    <ArrowLeft className="w-4 h-4" /> Leave
                </button>

                <div className="flex items-center gap-3">
                    {roomId && (
                        <>
                            <span className="text-xs text-text-secondary/60">Room:</span>
                            <span className="text-sm font-mono font-bold text-neon-cyan">{roomId}</span>
                            <button onClick={copyRoomCode}
                                className="p-1.5 rounded-lg bg-surface/50 border border-border/60 text-text-secondary hover:text-white hover:border-primary/40 transition-all cursor-pointer">
                                {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary/60">
                    {connected ? (
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> Connected</span>
                    ) : (
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-error" /> Disconnected</span>
                    )}
                </div>
            </div>

            {/* Game area */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
                <div className="flex flex-col lg:flex-row items-center gap-8 animate-fade-in">

                    {/* Players info */}
                    <div className="flex lg:flex-col gap-4 order-2 lg:order-1">
                        <div className={`bg-bg-card/80 backdrop-blur-xl border rounded-2xl p-4 w-28 text-center ${myPlayer === "X" ? "border-neon-cyan/40" : "border-border/60"}`}>
                            <XIcon className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
                            <p className="text-xl font-black text-white">{scores.X}</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                {online && myPlayer === "X" ? "You" : opponent || "X"}
                            </p>
                        </div>
                        <div className={`bg-bg-card/80 backdrop-blur-xl border rounded-2xl p-4 w-28 text-center ${myPlayer === "O" ? "border-neon-purple/40" : "border-border/60"}`}>
                            <Circle className="w-5 h-5 text-neon-purple mx-auto mb-1" />
                            <p className="text-xl font-black text-white">{scores.O}</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                {online && myPlayer === "O" ? "You" : opponent || "O"}
                            </p>
                        </div>
                    </div>

                    {/* Board */}
                    <div className="relative order-1 lg:order-2">
                        <div className="absolute -inset-10 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 rounded-[4rem] blur-3xl pointer-events-none" />
                        <div className="relative bg-bg-card/80 backdrop-blur-2xl border border-border/60 rounded-3xl p-6 shadow-[0_0_60px_-20px_#7c5cfc30]">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <div className="flex items-center gap-2.5">
                                    {turn === "X" ? <XIcon className="w-5 h-5 text-neon-cyan" /> : <Circle className="w-5 h-5 text-neon-purple" />}
                                    <span className="text-sm font-bold text-text-secondary">
                                        {result ? `${result.winner} wins!` : draw ? "Draw!" : online && myPlayer && turn !== myPlayer ? "Opponent's turn" : `${turn}'s turn`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {statusMsg && !statusMsg.startsWith("Error") && (
                                        <span className="text-[10px] text-text-secondary/50 max-w-24 text-right leading-tight">{statusMsg}</span>
                                    )}
                                    <button onClick={resetGame}
                                        className="p-2 rounded-xl bg-surface/50 border border-border/60 text-text-secondary hover:text-white hover:bg-surface-alt hover:border-primary/40 transition-all duration-200 cursor-pointer">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2.5">
                                {board.map((cell, i) => {
                                    const isWinCell = result?.line.includes(i);
                                    const isMyTurn = !online || (myPlayer !== null && turn === myPlayer);
                                    const canClick = isMyTurn && !cell && !result && !draw;
                                    return (
                                        <button key={i} onClick={() => handleCellClick(i)}
                                            className={`relative w-24 h-24 rounded-2xl border-2 transition-all duration-200 overflow-hidden
                                                ${canClick ? "cursor-pointer hover:border-primary/40" : "cursor-default"}
                                                ${isWinCell ? "border-neon-green/80 shadow-[0_0_20px_-5px_#00e5a0]" : cell ? "border-border/80" : "border-border/40 bg-bg-card/40 hover:bg-bg-card/60"}`}
                                        >
                                            {!cell && canClick && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />}
                                            {isWinCell && <div className="absolute inset-0 bg-neon-green/10 animate-pulse rounded-2xl" />}
                                            <span className="relative z-10 flex items-center justify-center w-full h-full">
                                                {cell === "X" && <XIcon className={`w-11 h-11 ${isWinCell ? "text-neon-green" : "text-neon-cyan"} drop-shadow-[0_0_8px_${isWinCell ? "#00e5a0" : "#00d2ff"}]`} />}
                                                {cell === "O" && <Circle className={`w-11 h-11 ${isWinCell ? "text-neon-green" : "text-neon-purple"} drop-shadow-[0_0_8px_${isWinCell ? "#00e5a0" : "#e040fb"}]`} />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Moves history */}
                    <div className="order-3">
                        <div className="bg-bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl p-4 w-28">
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-3 text-center font-bold">Moves</p>
                            <div className="flex flex-col-reverse gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                                {moves.length === 0 && <p className="text-[11px] text-text-muted text-center">—</p>}
                                {moves.map((idx, step) => (
                                    <div key={step} className="flex items-center gap-2 text-[11px] font-medium text-text-secondary/70 bg-surface/30 rounded-lg px-2.5 py-1.5">
                                        <span className={step % 2 === 0 ? "text-neon-cyan" : "text-neon-purple"}>{step % 2 === 0 ? "X" : "O"}</span>
                                        <span className="text-text-muted">pos {idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
