import type { GPageHeaderProps } from "./def/GPageHeader";

function GPageHeader({ badge, title, subtitle }: GPageHeaderProps) {
  return (
    <header>
      {badge}
      <h1 className="text-2xl sm:text-3xl font-bold text-text mt-3">{title}</h1>
      {subtitle && (
        <p className="text-sm text-text-secondary mt-1 max-w-xl">{subtitle}</p>
      )}
    </header>
  );
}

export { GPageHeader };
