import type { RefObject, MouseEvent } from "react";

interface IMessageComposerProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  disabled?: boolean;
  sendDisabled: boolean;
  sending: boolean;
  placeholder: string;
  ariaLabel: string;
  sendLabel: string;
  onChange: (value: string) => void;
  onSend: (e?: MouseEvent<HTMLElement>) => void;
}

interface IComposerErrorProps {
  message: string;
}

export type { IMessageComposerProps, IComposerErrorProps };
