"use client";

import { useEffect } from "react";
import { Send } from "lucide-react";

import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GTextField } from "@/component/common/GTextField";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { IComposerErrorProps, IMessageComposerProps } from "./def/MessageComposer";

function MessageComposer({
  inputRef,
  value,
  sendDisabled,
  sending,
  placeholder,
  ariaLabel,
  sendLabel,
  onChange,
  onSend,
}: IMessageComposerProps) {

  useEffect(() => {
    if (!sending) inputRef.current?.focus();
  }, [sending, inputRef]);

  return (
    <div className="flex items-center gap-2">
      <GTextField
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!sendDisabled) onSend();
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="flex-1"
      />
      <GButton
        onClick={onSend}
        disabled={sendDisabled}
        loading={sending}
        size={SizeEnum.md}
        startIcon={<GIcon icon={Send} size={SizeEnum.sm} color={AccentColorEnum.OnPrimary} />}>
        <span className="hidden sm:inline">{sendLabel}</span>
      </GButton>
    </div>
  );
}

function ComposerError({ message }: IComposerErrorProps) {
  return <GAlert severity={AccentColorEnum.Danger} className="mb-3">{message}</GAlert>;
}

export { ComposerError, MessageComposer };
