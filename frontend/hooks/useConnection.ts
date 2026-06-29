"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7127";

export function useConnection(endPoint: string) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Keep a ref so the cleanup closure always sees the latest instance.
  const connectionRef = useRef<HubConnection | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    console.log("start");

    const conn = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/${endPoint}`, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? LogLevel.Information
          : LogLevel.Error,
      )
      .build();

    connectionRef.current = conn;

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
      if (
        conn.state !== HubConnectionState.Disconnected ||
        isStartingRef.current
      ) {
        return;
      }

      isStartingRef.current = true;
      try {
        await conn.start();
        if (!cancelled) {
          setConnection(conn);
          setIsConnected(true);
          console.log("connected");
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
      } finally {
        isStartingRef.current = false;
      }
    };

    void start();
    return () => {
      cancelled = true;
      console.log("unmounted");
      connectionRef.current = null;
      if (conn.state !== HubConnectionState.Disconnected) {
        console.log("stopping");
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
