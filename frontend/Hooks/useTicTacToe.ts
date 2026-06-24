import { useEffect, useMemo, useState } from "react";
import { useConnection } from "./useConnection";
import { GamesKindEnum, TicTacToeGameState } from "@/types";
import { useAuth } from "@/app/AuthProvider";

function useTicTacToe() {
  const { user } = useAuth();
  const { connection, isConnected } = useConnection("gameHub");

  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<TicTacToeGameState | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const handleGameState = (state: TicTacToeGameState) => {
      setRoomId(state.roomId);
      setGameState(state);
      setIsSearching(false);
      setOpponentDisconnected(false);
    };

    const handleOpponentDisconnected = () => {
      setOpponentDisconnected(true);
      setGameState((prev) => {
        if (!prev) return null;
        return { ...prev, isFinished: true };
      });
    };

    connection.on("gameState", handleGameState);
    connection.on("OpponentDisconnected", handleOpponentDisconnected);

    return () => {
      connection.off("gameState", handleGameState);
      connection.off("OpponentDisconnected", handleOpponentDisconnected);
    };
  }, [connection]);

  const findMatch = async () => {
    if (!connection || !isConnected) return;
    setRoomId(null);
    setGameState(null);
    setOpponentDisconnected(false);
    setIsSearching(true);
    await connection.invoke("FindMatch", GamesKindEnum.TicTacTao);
  };

  const makeMove = async (cell: number) => {
    if (!connection || !gameState || gameState.isFinished) return;
    await connection.invoke("SendAction", "MAKE_MOVE", cell.toString());
  };

  const resetGame = async () => {
    // If we are currently searching, cancel the server‑side room
    if (isSearching && connection) {
      try {
        await connection.invoke("CancelSearch");
      } catch (e) {
        console.error("CancelSearch failed", e);
      }
    }
    setRoomId(null);
    setGameState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
  };

  const myPlayerId = user?.id;
  const isMyTurn = useMemo(() => {
    if (!gameState || !myPlayerId) return false;
    return gameState.currentTurnPlayerId === myPlayerId;
  }, [gameState, myPlayerId]);

  const amPlayer1 = gameState?.player1Id === myPlayerId;
  const mySymbol = amPlayer1 ? "X" : "O";

  const result = useMemo(() => {
    if (!gameState?.isFinished) return "playing";
    if (opponentDisconnected) return "opponentDisconnected";
    if (!gameState.winnerPlayerId) return "draw";
    if (gameState.winnerPlayerId === myPlayerId) return "win";
    return "lose";
  }, [gameState, opponentDisconnected, myPlayerId]);

  return {
    board: gameState?.board ?? Array(9).fill(""),
    roomId,
    gameState,
    isConnected,
    isSearching,
    opponentDisconnected,
    isMyTurn,
    mySymbol,
    result,
    findMatch,
    makeMove,
    resetGame,
  };
}

export { useTicTacToe };
