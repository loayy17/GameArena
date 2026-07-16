"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { gameService } from "@/services/def/GameService";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IGameState } from "./def/IGameState";
import type { IGameContext } from "./def/IGameContext";
import { useRouter } from "next/navigation";

const GameContext = createContext<TNullable<IGameContext>>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { isGameConnected } = useConnections();
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

  // ── SignalR subscriptions via service ───────────────────────────────
  useEffect(() => {
    const offState = gameService.onGameState((value) => {
      setState(value);
      setIsSearching(false);
      setOpponentDisconnected(false);
    });

    const offDisconnect = gameService.onOpponentDisconnect(() => {
      setOpponentDisconnected(true);
    });

    return () => { offState(); offDisconnect(); };
  }, []);

  // ── Initial state sync ──────────────────────────────────────────────
  useEffect(() => {
    if (!isGameConnected) return;
    gameService.requestCurrentState()
      .then((value) => { if (value) setState(value); })
      .finally(() => setIsInitialSyncDone(true));
  }, [isGameConnected]);

  // ── Actions ─────────────────────────────────────────────────────────
  const findMatch = useCallback(
    async (game: GamesKindEnum) => {
      if (isSearching) return;
      clearGameState();
      setLastGameType(game);
      setIsSearching(true);
      await gameService.findMatch(game);
    },
    [clearGameState, isSearching],
  );

  const startGame = useCallback(
    async (friendId: TNullable<string>, gameKind: GamesKindEnum) => {
      setLastGameType(gameKind);
      await gameService.startGame(friendId, gameKind);
    },
    [],
  );

  const inviteFriend = useCallback(
    async (friendId: string, game: GamesKindEnum) => {
      await gameService.inviteFriend(friendId, game);
    },
    [],
  );

  const inviteToRoom = useCallback(
    async (friendId: string) => {
      await gameService.inviteToRoom(friendId);
    },
    [],
  );

  const leaveGame = useCallback(async () => {
    await gameService.leaveGame();
    goToLobby();
  }, [goToLobby]);

  const playAgain = useCallback(async () => {
    await gameService.playAgain();
  }, []);

  const resetGame = useCallback(async () => {
    if (isSearching) await gameService.cancelSearch();
    await gameService.leaveGame();
    goToLobby();
  }, [goToLobby, isSearching]);

  const sendAction = useCallback(
    async (action: object) => {
      await gameService.sendAction(action);
    },
    [],
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
      playAgain,
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
      playAgain,
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
