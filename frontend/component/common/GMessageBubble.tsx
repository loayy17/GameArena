import clsx from "clsx";
import type { GMessageBubbleProps } from "./def/GMessageBubble";
import { messageBubble, rounded } from "./tokens";

function GMessageBubble({ outgoing = false, children, meta }: GMessageBubbleProps) {
  return (
    <div
      className={clsx(
        messageBubble.base,
        rounded.lg,
        outgoing ? messageBubble.out : messageBubble.in,
      )}
    >
      {children}
      {meta}
    </div>
  );
}

export { GMessageBubble };
