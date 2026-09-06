import type { IGBrandTextProps } from "./def/GBrandText";

function GBrandText({ name, className }: IGBrandTextProps) {
  return (
    <span className={className}>
      {name.split(" ").map((part, index) => (
        <span key={index} className={index === 0 ? undefined : "text-primary"}>
          {index > 0 ? ` ${part}` : part}
        </span>
      ))}
    </span>
  );
}

export { GBrandText };
