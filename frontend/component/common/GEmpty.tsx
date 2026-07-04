import type { GEmptyProps } from "./def/GEmpty";

const GEmpty = ({
  icon,
  title,
  description,
  children,
}: GEmptyProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-text-muted mb-4">{icon}</div>
    <h3 className="text-text text-lg font-semibold mb-1">{title}</h3>
    <p className="text-text-secondary text-sm max-w-sm">{description}</p>
    {children}
  </div>
);

export { GEmpty };
