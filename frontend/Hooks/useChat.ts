"use client";
import { useEffect, useState, useCallback } from "react";
import { useConnection } from "./useConnection";
import { useAuth } from "@/app/AuthProvider";
import { chatApi } from "@/lib/chat.api";

export function useChat(receiverId?: string | null) {
  const { connection } = useConnection("chatHub");
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);

  // Load history when receiverId changes
  useEffect(() => {
    if (!receiverId) return;
    chatApi
      .getMessages(receiverId)
      .then((res) => setMessages(res.data.data || []));
  }, [receiverId]);

  useEffect(() => {
    if (!connection) return;

    const handlePrivate = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleGlobal = (msg: any) => {
      setGlobalMessages((prev) => [...prev, msg]);
    };

    connection.on("ReceivePrivateMessage", handlePrivate);
    connection.on("ReceiveGlobalMessage", handleGlobal);

    return () => {
      connection.off("ReceivePrivateMessage", handlePrivate);
      connection.off("ReceiveGlobalMessage", handleGlobal);
    };
  }, [connection]);

  const sendPrivate = useCallback(
    (message: string) => {
      if (!connection || !receiverId) return;
      connection.invoke("SendPrivateMessage", receiverId, message);
    },
    [connection, receiverId],
  );

  const sendGlobal = useCallback(
    (message: string) => {
      if (!connection) return;
      connection.invoke("SendGlobalMessage", message);
    },
    [connection],
  );

  return { messages, globalMessages, sendPrivate, sendGlobal };
}
