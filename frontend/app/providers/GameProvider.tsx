"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  const searchingRef = useRef(false);
  const router = useRouter();
  const reset = useCallback(() => {
    setState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
    router.push("/games");
  }, [router]);

  useEffect(() => {
    searchingRef.current = isSearching;
  }, [isSearching]);

  useEffect(() => {
    if (!gameConnection) return;
    const updateState = (value: IGameState) => {
      setState(value);
      setIsSearching(false);
      setOpponentDisconnected(false);
    };
    const syncState = () => gameConnection.invoke<TNullable<IGameState>>("GetCurrentState").then((value) => value && updateState(value));
    const opponentDisconnect = () => setOpponentDisconnected(true);
    gameConnection.on("gameState", updateState);
    gameConnection.on("OpponentDisconnected", opponentDisconnect);
    gameConnection.onreconnected(syncState);
    syncState();
    return () => {
      gameConnection.off("gameState", updateState);
      gameConnection.off("OpponentDisconnected", opponentDisconnect);
      gameConnection.onreconnected(() => {});
    };
  }, [gameConnection]);

  const findMatch = useCallback(
    async (game: GamesKindEnum) => {
      if (!service) return;
      reset();
      setIsSearching(true);
      await service.findMatch(game);
    },
    [service, reset],
  );

  const startGame = useCallback(
    async (friendId: TNullable<string>, gameKind: GamesKindEnum) => {
      if (!service) return;
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
    await service?.leaveGame();
    reset();
  }, [service, reset]);

  const resetGame = useCallback(async () => {
    if (searchingRef.current) await service?.cancelSearch();

    reset();
  }, [service, reset]);

  const sendAction = useCallback(
    (action: object) => {
      service?.sendAction(action);
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
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      resetGame,
      sendAction,
    }),
    [state, isSearching, isGameConnected, opponentDisconnected, findMatch, startGame, inviteFriend, inviteToRoom, leaveGame, resetGame, sendAction],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
