"use client";

import { useEffect, useMemo, useState } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";

export function useTicTacToe() {
  const { user } = useAuth();
  const { gameConnection: connection, isGameConnected: isConnected } =
    useConnections();

  const myPlayerId = user?.id;

  //? states
  const [roomId, setRoomId] = useState<TNullable<string>>(null);
  const [gameState, setGameState] =
    useState<TNullable<ITicTacToeGameState>>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const board: string[] = gameState?.board ?? Array<string>(9).fill("");
  const amPlayer1 = gameState?.player1Id === myPlayerId;
  const mySymbol = amPlayer1 ? "X" : "O";

  //# memo for make it hold the value of isMyTurn and result until gameState or myPlayerId changes
  const isMyTurn = useMemo(() => {
    if (!gameState || !myPlayerId) return false;
    return gameState.currentTurnPlayerId === myPlayerId;
  }, [gameState, myPlayerId]);
  const result = useMemo(() => {
    if (!gameState?.isFinished) return "playing";
    if (opponentDisconnected) return "opponentDisconnected";
    if (!gameState.winnerPlayerId) return "draw";
    if (gameState.winnerPlayerId === myPlayerId) return "win";
    return "lose";
  }, [gameState, opponentDisconnected, myPlayerId]);

  // methods
  const handleGameState = (state: ITicTacToeGameState) => {
    setRoomId(state.roomId);
    setGameState(state);
    setIsSearching(false);
    setOpponentDisconnected(false);
  };

  const handleOpponentDisconnected = () => {
    setOpponentDisconnected(true);
    setGameState((prev) => (prev ? { ...prev, isFinished: true } : null));
  };

  //! Hooks
  useEffect(() => {
    if (!connection) return;
    connection.on("gameState", handleGameState);
    connection.on("OpponentDisconnected", handleOpponentDisconnected);
    connection
      .invoke<TNullable<ITicTacToeGameState>>("GetCurrentState")
      .then((state) => {
        if (state) handleGameState(state);
      });
    return () => {
      connection.off("gameState", handleGameState);
      connection.off("OpponentDisconnected", handleOpponentDisconnected);
    };
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    const handleReconnected = () => {
      connection
        .invoke("GetCurrentState")
        .then((state: TNullable<ITicTacToeGameState>) => {
          if (state) {
            setRoomId(state.roomId);
            setGameState(state);
            setOpponentDisconnected(false);
          }
        })
        .catch((e) => console.error("GetCurrentState failed", e));
    };

    connection.onreconnected(handleReconnected);
  }, [connection]);

  // ======================
  // actions
  // ======================
  const findMatch = async () => {
    if (!connection || !isConnected) return;

    setRoomId(null);
    setGameState(null);
    setOpponentDisconnected(false);
    setIsSearching(true);

    await connection.invoke("FindMatch", GamesKindEnum.TicTacToe);
  };

  const makeMove = async (cell: number) => {
    if (!connection || !gameState || gameState.isFinished) return;
    await connection.invoke("SendAction", "MAKE_MOVE", cell.toString());
  };
  const startGame = async (friendId: string | null) => {
    if (!connection || !isConnected) return;
    await connection.invoke("StartGame", friendId, GamesKindEnum.TicTacToe);
  };
  const inviteFriend = async (friendId: string) => {
    if (!connection || !isConnected) return;
    await connection.invoke("InviteFriend", friendId, GamesKindEnum.TicTacToe);
  };
  const inviteToRoom = async (friendId: string) => {
    if (!connection || !isConnected) return;
    await connection.invoke("InviteToRoom", friendId);
  };
  const leaveGame = async () => {
    if (!connection) return;
    await connection.invoke("LeaveGame");
    setRoomId(null);
    setGameState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
  };
  const resetGame = async () => {
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

  // ======================
  // return API
  // ======================
  const isBotGame = gameState?.isBotGame ?? false;

  return {
    board,
    roomId,
    gameState,
    isConnected,
    isSearching,
    opponentDisconnected,
    isBotGame,
    isMyTurn,
    mySymbol,
    result,
    findMatch,
    makeMove,
    resetGame,
    inviteFriend,
    inviteToRoom,
    startGame,
    leaveGame,
  };
}
