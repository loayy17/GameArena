import { cn } from "@/lib/cn";
import type { IGEmptyProps } from "./def/GEmpty";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const emptyPadding: Partial<Record<SizeEnum, string>> = {
  [SizeEnum.sm]: "py-8",
  [SizeEnum.md]: "py-12",
  [SizeEnum.lg]: "py-16",
  [SizeEnum.xl]: "py-20",
};

function GEmpty({ icon, title, description, padding = SizeEnum.lg, className, children }: IGEmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", emptyPadding[padding], className)}>
      {icon && <div className="text-text-muted mb-4 opacity-60">{icon}</div>}
      <h3 className="text-text text-lg font-semibold mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm leading-relaxed">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export { GEmpty };
