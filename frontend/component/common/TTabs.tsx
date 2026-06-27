import clsx from "clsx";
import { TTabsProps } from "./def/TTabs";
import { TButton } from "./TButton";

function TTabs({ tabs, value, onChange }: TTabsProps) {
  return (
    <div role="tablist" className="flex gap-2 border-b border-border">
      {tabs.map((tab) => {
        const active = value === tab.id;

        return (
          <TButton
            key={tab.id}
            role="tab"
            disabled={tab.disabled}
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-t-xl transition-all",
              active
                ? "bg-primary text-text"
                : "text-text-secondary hover:bg-primary/10",
            )}
          >
            {tab.icon}
            {tab.label}
          </TButton>
        );
      })}
    </div>
  );
}

export { TTabs };
