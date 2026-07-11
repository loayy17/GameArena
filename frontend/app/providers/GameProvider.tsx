"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { GameService } from "@/services/gameService";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IGameState } from "./def/IGameState";
import type { IGameContext } from "./def/IGameContext";
import { useRouter } from "next/navigation";

const GameContext = createContext<TNullable<IGameContext>>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { gameConnection, isGameConnected } = useConnections();
  const service = useMemo(() => (gameConnection ? new GameService(gameConnection) : null), [gameConnection]);
  const [state, setState] = useState<TNullable<IGameState>>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);
  const [lastGameType, setLastGameType] = useState<GamesKindEnum | null>(null);
  const router = useRouter();

  const goToLobby = useCallback(() => {
    setState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
    router.push("/games");
  }, [router]);

  const clearGameState = useCallback(() => {
    setState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
  }, []);

  useEffect(() => {
    if (!gameConnection) return;
    const handleGameState = (value: IGameState) => {
      setState(value);
      setIsSearching(false);
      setOpponentDisconnected(false);
    };
    const handleOpponentDisconnect = () => setOpponentDisconnected(true);
    const syncState = () =>
      gameConnection
        .invoke<TNullable<IGameState>>("GetCurrentState")
        .then((value) => {
          if (value) handleGameState(value);
        })
        .finally(() => setIsInitialSyncDone(true));

    gameConnection.on("gameState", handleGameState);
    gameConnection.on("OpponentDisconnected", handleOpponentDisconnect);
    gameConnection.onreconnected(syncState);
    syncState();

    return () => {
      gameConnection.off("gameState", handleGameState);
      gameConnection.off("OpponentDisconnected", handleOpponentDisconnect);
      gameConnection.onreconnected(() => {});
      setIsInitialSyncDone(false);
    };
  }, [gameConnection]);

  const findMatch = useCallback(
    async (game: GamesKindEnum) => {
      if (!service || isSearching) return;
      clearGameState();
      setLastGameType(game);
      setIsSearching(true);
      await service.findMatch(game);
    },
    [service, clearGameState, isSearching],
  );

  const startGame = useCallback(
    async (friendId: TNullable<string>, gameKind: GamesKindEnum) => {
      if (!service) return;
      setLastGameType(gameKind);
      await service.startGame(friendId, gameKind);
    },
    [service],
  );

  const inviteFriend = useCallback(
    async (friendId: string, game: GamesKindEnum) => {
      if (!service) return;
      await service.inviteFriend(friendId, game);
    },
    [service],
  );

  const inviteToRoom = useCallback(
    async (friendId: string) => {
      if (!service) return;
      await service.inviteToRoom(friendId);
    },
    [service],
  );

  const leaveGame = useCallback(async () => {
    if (!service) return;
    await service.leaveGame();
    goToLobby();
  }, [service, goToLobby]);

  const resetGame = useCallback(async () => {
    if (isSearching) await service?.cancelSearch();
    goToLobby();
  }, [service, goToLobby, isSearching]);

  const sendAction = useCallback(
    async (action: object) => {
      await service?.sendAction(action);
    },
    [service],
  );

  const value = useMemo<IGameContext>(
    () => ({
      roomId: state?.roomId ?? null,
      state,
      isSearching,
      isConnected: isGameConnected,
      opponentDisconnected,
      isInitialSyncDone,
      lastGameType,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      resetGame,
      sendAction,
    }),
    [
      state,
      isSearching,
      isGameConnected,
      opponentDisconnected,
      isInitialSyncDone,
      lastGameType,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      resetGame,
      sendAction,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
