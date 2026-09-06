"use client";

import { useEffect, useRef } from "react";
import { CheckCheck, MessagesSquare } from "lucide-react";

import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { cn } from "@/lib/cn";

import { TypingIndicator } from "./TypingIndicator";

import type { IMessageBubbleProps, IMessageListProps } from "./def/MessageList";

function MessageBubble({ message, outgoing }: IMessageBubbleProps) {
  const time = new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("flex", outgoing ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-message-mobile min-w-0 rounded-lg px-4 py-2.5 text-sm leading-relaxed wrap-anywhere sm:max-w-message-tablet",
          outgoing ? "msg-outgoing ms-auto rounded-ee-sm bg-primary text-on-primary" : "rounded-es-sm border border-border bg-surface text-text",
        )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div
          className={cn(
            "mt-1.5 flex items-center gap-1.5 text-2xs font-medium",
            outgoing ? "justify-end text-on-primary/80" : "text-text-muted",
          )}>
          <span>{time}</span>
          {outgoing && <GIcon icon={CheckCheck} size={SizeEnum.sm} className={message.isRead ? "opacity-100" : "opacity-50"} />}
        </div>
      </div>
    </div>
  );
}

function MessageList({ messages, selectedFriendId, loading, typing, error, errorTitle, emptyTitle, emptyDescription, retryLabel, onRetry }: IMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    stickToBottomRef.current = true;
  }, [selectedFriendId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <GAsync loading={loading} error={error} spinnerSize={SizeEnum.lg} errorTitle={errorTitle} retryLabel={retryLabel} onRetry={onRetry} className="h-full">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <GEmpty
              icon={<GIcon icon={MessagesSquare} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
              title={emptyTitle}
              description={emptyDescription}
            />
          </div>
        ) : (
          <div className="space-y-4" dir="auto">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.senderId}-${new Date(message.sentAt).getTime()}-${index}`} message={message} outgoing={message.senderId !== selectedFriendId} />
            ))}
            {typing && <TypingIndicator />}
          </div>
        )}
      </GAsync>
    </div>
  );
}

export { MessageList };
