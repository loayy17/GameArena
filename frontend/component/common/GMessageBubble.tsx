import clsx from "clsx";
import type { GMessageBubbleProps } from "./def/GMessageBubble";

function GMessageBubble({ outgoing = false, children, meta }: GMessageBubbleProps) {
  return (
    <div
      className={clsx(
        "max-w-[85%] sm:max-w-[70%] min-w-0 px-4 py-2.5 text-sm leading-relaxed wrap-anywhere break-words rounded-[var(--radius-lg)]",
        outgoing
          ? "ms-auto rounded-ee-sm bg-primary text-on-primary"
          : "rounded-es-sm border border-border bg-surface text-text",
      )}
    >
      {children}
      {meta}
    </div>
  );
}

export { GMessageBubble };
