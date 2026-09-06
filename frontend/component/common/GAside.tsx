import { cn } from "@/lib/cn";

import type { IGAsideProps } from "./def/GAside";

function GAside({ side = "start", label, className, children, ...props }: IGAsideProps) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "flex shrink-0 flex-col bg-bg-sidebar",
        side === "start" ? "border-e" : "border-s",
        className,
      )}
      {...props}>
      {children}
    </aside>
  );
}

export { GAside };
