"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ConnectionState, type HubConnectionStates } from "@/domain/enum/ConnectionState";
import { friendService } from "@/services/def/FriendService";
import { notificationService } from "@/services/def/NotificationService";
import { chatService } from "@/services/def/ChatService";
import { gameService } from "@/services/def/GameService";
import { useAuth } from "./AuthProvider";
import type { HubConnection } from "@microsoft/signalr";
import type { IConnectionContext } from "@/domain/meta/IConnectionContext";
import type { TNullable, TOptional } from "@/domain/type/TCommon";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://gamearena-ppnc.onrender.com";

const ConnectionContext = createContext<TOptional<IConnectionContext>>(undefined);

function createConnection(name: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/${name}`, { withCredentials: true })
    .withAutomaticReconnect({ nextRetryDelayInMilliseconds: (retryContext) => Math.min(retryContext.elapsedMilliseconds * 1.5, 30000) })
    .withKeepAliveInterval(15_000)
    .withServerTimeout(60_000)
    .configureLogging(process.env.NODE_ENV === "development" ? LogLevel.Information : LogLevel.Error)
    .build();
}

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [gameConnection, setGameConnection] = useState<TNullable<HubConnection>>(null);
  const [socialConnection, setSocialConnection] = useState<TNullable<HubConnection>>(null);
  const [socialReconnectKey, setSocialReconnectKey] = useState(0);

  const [connectionStates, setConnectionStates] = useState<HubConnectionStates>({
    game: ConnectionState.Disconnected,
    social: ConnectionState.Disconnected,
  });

  const gameRef = useRef<TNullable<HubConnection>>(null);
  const socialRef = useRef<TNullable<HubConnection>>(null);
  const socialKeyRef = useRef(0);
  const cancelledRef = useRef(false);
  const hubGenRef = useRef<Record<keyof HubConnectionStates, number>>({ game: 0, social: 0 });
  const userId = user?.id;

  useEffect(() => {
    socialKeyRef.current = socialReconnectKey;
  }, [socialReconnectKey]);

  useEffect(() => {
    if (!userId) return;
    cancelledRef.current = false;

    const updateState = (hub: keyof HubConnectionStates, state: ConnectionState) => {
      setConnectionStates((prev) => ({ ...prev, [hub]: state }));
    };

    const startHub = async (
      name: string,
      hubKey: keyof HubConnectionStates,
      stateSetter: (conn: TNullable<HubConnection>) => void,
      ref: React.MutableRefObject<TNullable<HubConnection>>,
    ) => {
      const conn = createConnection(name);
      const gen = ++hubGenRef.current[hubKey];

      conn.onreconnecting(() => {
        if (ref.current === conn) updateState(hubKey, ConnectionState.Reconnecting);
      });
      conn.onreconnected(() => {
        if (ref.current !== conn) return;
        updateState(hubKey, ConnectionState.Connected);

        if (name === "socialHub") {
          setSocialReconnectKey((k) => k + 1);
        }
      });
      conn.onclose(() => {
        if (ref.current === conn) updateState(hubKey, ConnectionState.Disconnected);
      });

      const connectWithRetry = async (attempt: number) => {
        updateState(hubKey, ConnectionState.Connecting);

        try {
          await conn.start();

          if (cancelledRef.current || gen !== hubGenRef.current[hubKey]) {
            conn.stop().catch(() => {});
            return;
          }

          updateState(hubKey, ConnectionState.Connected);
          ref.current = conn;

          if (name === "gameHub") {
            gameService.setConnection(conn);
          } else if (name === "socialHub") {
            notificationService.setConnection(conn);
            friendService.setConnection(conn);
            chatService.setConnection(conn);
          }

          stateSetter(conn);
        } catch (err) {
          if (cancelledRef.current || gen !== hubGenRef.current[hubKey]) return;

          if (err instanceof Error && err.message.toLowerCase().includes("unauthorized")) {
            updateState(hubKey, ConnectionState.Disconnected);
            window.location.replace("/login");
            return;
          }

          if (attempt >= 4) {
            updateState(hubKey, ConnectionState.Disconnected);
            return;
          }

          setTimeout(() => void connectWithRetry(attempt + 1), Math.min(1000 * 2 ** attempt, 15000));
        }
      };

      void connectWithRetry(0);
    };

    startHub("gameHub", "game", setGameConnection, gameRef);
    startHub("socialHub", "social", setSocialConnection, socialRef);

    return () => {
      cancelledRef.current = true;

      gameService.disconnect();
      friendService.disconnect();
      notificationService.disconnect();
      chatService.disconnect();

      if (gameRef.current) {
        gameRef.current.off("Reconnecting");
        gameRef.current.off("Reconnected");
        gameRef.current.off("Closed");
      }
      if (socialRef.current) {
        socialRef.current.off("Reconnecting");
        socialRef.current.off("Reconnected");
        socialRef.current.off("Closed");
      }

      gameRef.current?.stop().catch(() => {});
      socialRef.current?.stop().catch(() => {});
      gameRef.current = null;
      socialRef.current = null;
      setGameConnection(null);
      setSocialConnection(null);
      setSocialReconnectKey(0);
      socialKeyRef.current = 0;

      setConnectionStates({
        game: ConnectionState.Disconnected,
        social: ConnectionState.Disconnected,
      });
    };
  }, [userId]);

  const stopConnections = useCallback(async () => {
    cancelledRef.current = true;
    const conns = [gameRef.current, socialRef.current];

    gameService.disconnect();
    friendService.disconnect();
    notificationService.disconnect();
    chatService.disconnect();

    gameRef.current = null;
    socialRef.current = null;
    await Promise.all(conns.map((c) => c?.stop().catch(() => {})));
    setGameConnection(null);
    setSocialConnection(null);
    setSocialReconnectKey(0);
    socialKeyRef.current = 0;
    setConnectionStates({
      game: ConnectionState.Disconnected,
      social: ConnectionState.Disconnected,
    });
  }, []);

  const value = useMemo<IConnectionContext>(() => {
    const cs = connectionStates;
    const isGameConnected = cs.game === ConnectionState.Connected;
    const isSocialConnected = cs.social === ConnectionState.Connected;

    return {
      gameConnection,
      socialConnection,
      connectionStates: cs,
      isGameConnected,
      isSocialConnected,
      isGameConnecting: cs.game === ConnectionState.Connecting || cs.game === ConnectionState.Reconnecting,
      isSocialConnecting: cs.social === ConnectionState.Connecting || cs.social === ConnectionState.Reconnecting,
      isAllConnected: isGameConnected && isSocialConnected,
      socialReconnectKey,
      stopConnections,
    };
  }, [gameConnection, socialConnection, connectionStates, socialReconnectKey, stopConnections]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnections(): IConnectionContext {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnections must be used within a ConnectionProvider.");
  }
  return ctx;
}
