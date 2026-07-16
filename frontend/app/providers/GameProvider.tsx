"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  const [pendingPlayAgainRequest, setPendingPlayAgainRequest] = useState<{ requesterId: string; requesterUsername: string } | null>(null);
  const [requestedPlayAgain, setRequestedPlayAgain] = useState(false);
  const router = useRouter();
  const syncAttempted = useRef(false);

  const goToLobby = useCallback(() => {
    setState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
    setPendingPlayAgainRequest(null);
    setRequestedPlayAgain(false);
    router.push("/games");
  }, [router]);

  // ── SignalR subscriptions via service ───────────────────────────────
  useEffect(() => {
    const offState = gameService.onGameState((value) => {
      setState(value);
      setIsSearching(false);
      setOpponentDisconnected(false);
      setPendingPlayAgainRequest(null);
      setRequestedPlayAgain(false);
    });

    const offDisconnect = gameService.onOpponentDisconnect(() => {
      setOpponentDisconnected(true);
      setPendingPlayAgainRequest(null);
      setRequestedPlayAgain(false);
    });

    const offPlayAgainReq = gameService.onPlayAgainRequest((data) => {
      setPendingPlayAgainRequest(data);
    });

    const offPlayAgainRes = gameService.onPlayAgainResponse((data) => {
      setRequestedPlayAgain(false);
      if (!data.accepted) {
        goToLobby();
      }
    });

    return () => { offState(); offDisconnect(); offPlayAgainReq(); offPlayAgainRes(); };
  }, [goToLobby]);

  // ── Initial state sync ──────────────────────────────────────────────
  useEffect(() => {
    if (!isGameConnected || syncAttempted.current) return;
    syncAttempted.current = true;

    let cancelled = false;
    let retries = 0;
    const maxRetries = 10;

    const attempt = () => {
      gameService.requestCurrentState()
        .then((value) => { if (value && !cancelled) setState(value); })
        .catch(() => {
          if (!cancelled && retries < maxRetries) {
            retries++;
            setTimeout(attempt, 150 * retries);
          }
        })
        .finally(() => { if (!cancelled) setIsInitialSyncDone(true); });
    };

    attempt();
    return () => { cancelled = true; };
  }, [isGameConnected]);

  // ── Actions ─────────────────────────────────────────────────────────
  const findMatch = useCallback(
    async (game: GamesKindEnum) => {
      if (isSearching) return;
      setState(null);
      setIsSearching(false);
      setOpponentDisconnected(false);
      setPendingPlayAgainRequest(null);
      setRequestedPlayAgain(false);
      setLastGameType(game);
      setIsSearching(true);
      try { await gameService.findMatch(game); }
      catch { setIsSearching(false); }
    },
    [isSearching],
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
    try { await gameService.leaveGame(); }
    catch { /* navigate regardless */ }
    goToLobby();
  }, [goToLobby]);

  const requestPlayAgain = useCallback(async () => {
    setRequestedPlayAgain(true);
    try { await gameService.requestPlayAgain(); }
    catch { setRequestedPlayAgain(false); }
  }, []);

  // ── Timeout: reset requestedPlayAgain after 30s ─────────────────────
  useEffect(() => {
    if (!requestedPlayAgain) return;
    const timer = setTimeout(() => {
      setRequestedPlayAgain(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [requestedPlayAgain]);

  const respondPlayAgain = useCallback(async (accept: boolean) => {
    try {
      await gameService.respondPlayAgain(accept);
      setPendingPlayAgainRequest(null);
      if (!accept) goToLobby();
    } catch {
      // keep dialog open so user can retry or use Go to Lobby
    }
  }, [goToLobby]);

  const resetGame = useCallback(async () => {
    try {
      if (isSearching) await gameService.cancelSearch();
    } catch { /* ignore */ }
    try { await gameService.leaveGame(); }
    catch { /* navigate regardless */ }
    goToLobby();
  }, [goToLobby, isSearching]);

  const createLobby = useCallback(async (gameKind: GamesKindEnum) => {
    try { await gameService.createLobby(gameKind); }
    catch { /* ignore */ }
  }, []);

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
      pendingPlayAgainRequest,
      requestedPlayAgain,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      requestPlayAgain,
      respondPlayAgain,
      resetGame,
      createLobby,
      sendAction,
    }),
    [
      state,
      isSearching,
      isGameConnected,
      opponentDisconnected,
      isInitialSyncDone,
      lastGameType,
      pendingPlayAgainRequest,
      requestedPlayAgain,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      requestPlayAgain,
      respondPlayAgain,
      resetGame,
      createLobby,
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
