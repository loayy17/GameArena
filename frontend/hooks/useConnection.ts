"use client";

import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import type {
  HubConnection,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://gamearena-ppnc.onrender.com";

export function useConnection(endPoint: string) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const conn = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/${endPoint}`, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? LogLevel.Information
          : LogLevel.Error,
      )
      .build();

    conn.onreconnecting(() => {
      if (!cancelled) setIsConnected(false);
    });

    conn.onreconnected(() => {
      if (!cancelled) setIsConnected(true);
    });

    conn.onclose(() => {
      if (!cancelled) {
        setIsConnected(false);
        setConnection(null);
      }
    });

    const start = async () => {
      try {
        await conn.start();
        if (!cancelled) {
          setConnection(conn);
          setIsConnected(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.error(`SignalR: Failed to connect to /${endPoint}`, err);
        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("unauthorized")
        ) {
          window.location.replace("/login");
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (conn.state !== HubConnectionState.Disconnected) {
        conn.stop().catch(() => {
          console.error(`SignalR: Failed to stop connection to /${endPoint}`);
        });
      }
      setConnection(null);
      setIsConnected(false);
    };
  }, [endPoint]);

  return { connection, isConnected };
}
