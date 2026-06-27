"use client";
import { useEffect, useState, useCallback } from "react";
import { useConnection } from "./useConnection";
import { chatService } from "@/services/def/ChatService";
import type { IMessage } from "@/domain/meta/IMessage";

export function useChat(receiverId?: string | null) {
  const { connection } = useConnection("chatHub");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [globalMessages, setGlobalMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!receiverId) return;

    let alive = true;

    void (async () => {
      try {
        const res = await chatService.getMessagesByFriendId(receiverId);
        if (alive) {
          setMessages(
            (res.data ?? []).map((message) => ({
              ...message,
              sentAt: new Date(message.sentAt),
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    })();

    return () => {
      alive = false;
    };
  }, [receiverId]);

  useEffect(() => {
    if (!connection) return;

    const handlePrivate = (msg: IMessage) => {
      setMessages((prev) =>
        prev.some(
          (item) =>
            item.senderId === msg.senderId &&
            item.receiverId === msg.receiverId &&
            item.sentAt.getTime() === msg.sentAt.getTime() &&
            item.content === msg.content,
        )
          ? prev
          : [...prev, msg],
      );
    };
    const handleGlobal = (msg: IMessage) => {
      setGlobalMessages((prev) => [...prev, msg]);
    };

    connection.on("chat:private", handlePrivate);
    connection.on("chat:global", handleGlobal);

    return () => {
      connection.off("chat:private", handlePrivate);
      connection.off("chat:global", handleGlobal);
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
