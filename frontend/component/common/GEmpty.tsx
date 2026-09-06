import { cn } from "@/lib/cn";

import type { IGEmptyProps } from "./def/GEmpty";

function GEmpty({ icon, title, description, className, children }: IGEmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="mb-4 text-text-muted opacity-60">{icon}</div>}
      {title && <h3 className="mb-1 text-lg font-semibold text-text">{title}</h3>}
      {description && <p className="max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export { GEmpty };
