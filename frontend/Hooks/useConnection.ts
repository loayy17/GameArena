import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";

export function useConnection(endPoint: string) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://boxed-careful-marcus-plus.trycloudflare.com/${endPoint}`, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.onreconnecting(() => {
      setIsConnected(false);
      console.warn("SignalR: Connection lost. Reconnecting...");
    });

    newConnection.onreconnected(() => {
      setIsConnected(true);
      console.log("SignalR: Connection re-established.");
    });

    newConnection.onclose(() => {
      setIsConnected(false);
      console.error("SignalR: Connection permanently closed.");
    });

    async function startHub() {
      try {
        await newConnection.start();
        console.log(`SignalR: Connected to hub at /${endPoint}`);
        setConnection(newConnection);
        setIsConnected(true);
      } catch (error) {
        console.error("SignalR: Initial connection failed: ", error);
      }
    }

    startHub();
    return () => {
      if (newConnection) {
        try {
          newConnection.stop();
          console.log(`SignalR: Disconnected from /${endPoint}`);
        } catch (err) {
          console.error("SignalR: Error during teardown: ", err);
        }
      }
    };
  }, [endPoint]); // Triggers fresh teardown and rebuild safely if the endpoint changes

  return { connection, isConnected };
}
