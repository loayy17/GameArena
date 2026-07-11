"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { HubConnection } from "@microsoft/signalr";
import type { IConnectionContext } from "@/domain/meta/IConnectionContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://gamearena-ppnc.onrender.com";

const ConnectionContext = createContext<IConnectionContext | undefined>(undefined);

function createConnection(name: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/${name}`, { withCredentials: true })
    .withAutomaticReconnect()
    .configureLogging(process.env.NODE_ENV === "development" ? LogLevel.Information : LogLevel.Error)
    .build();
}

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [chatConnection, setChatConnection] = useState<HubConnection | null>(null);
  const [gameConnection, setGameConnection] = useState<HubConnection | null>(null);
  const [socialConnection, setSocialConnection] = useState<HubConnection | null>(null);
  const [socialReconnectKey, setSocialReconnectKey] = useState(0);

  const chatRef = useRef<HubConnection | null>(null);
  const gameRef = useRef<HubConnection | null>(null);
  const socialRef = useRef<HubConnection | null>(null);
  const socialKeyRef = useRef(0);

  useEffect(() => {
    socialKeyRef.current = socialReconnectKey;
  }, [socialReconnectKey]);

  useEffect(() => {
    let cancelled = false;

    const startHub = async (
      name: string,
      stateSetter: (conn: HubConnection | null) => void,
      ref: React.MutableRefObject<HubConnection | null>,
    ) => {
      const conn = createConnection(name);
      try {
        await conn.start();
        if (cancelled) {
          conn.stop().catch(() => {});
          return;
        }
        if (name === "socialHub") {
          conn.onreconnected(() => {
            if (!socialKeyRef.current) return;
            setSocialReconnectKey((k) => k + 1);
          });
        }
        ref.current = conn;
        stateSetter(conn);
      } catch (err) {
        if (!cancelled && err instanceof Error && err.message.toLowerCase().includes("unauthorized")) {
          window.location.replace("/login");
        }
      }
    };

    startHub("chatHub", setChatConnection, chatRef);
    startHub("gameHub", setGameConnection, gameRef);
    startHub("socialHub", setSocialConnection, socialRef);

    return () => {
      cancelled = true;
      chatRef.current?.stop().catch(() => {});
      gameRef.current?.stop().catch(() => {});
      socialRef.current?.stop().catch(() => {});
      chatRef.current = null;
      gameRef.current = null;
      socialRef.current = null;
      setChatConnection(null);
      setGameConnection(null);
      setSocialConnection(null);
      setSocialReconnectKey(0);
      socialKeyRef.current = 0;
    };
  }, []);

  const value = useMemo<IConnectionContext>(
    () => ({
      chatConnection,
      gameConnection,
      socialConnection,
      isChatConnected: chatConnection !== null,
      isGameConnected: gameConnection !== null,
      isSocialConnected: socialConnection !== null,
      socialReconnectKey,
    }),
    [chatConnection, gameConnection, socialConnection, socialReconnectKey],
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections(): IConnectionContext {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnections must be used within a ConnectionProvider.");
  }
  return ctx;
}
