import type { ReactNode } from "react";

interface GMessageBubbleProps {
  outgoing?: boolean;
  children: ReactNode;
  meta?: ReactNode;
}

export type { GMessageBubbleProps };
