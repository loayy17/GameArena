import clsx from "clsx";
import type { GTileProps } from "./def/GTile";
import { sizes } from "@/domain/constant/sizes";

function GTile({ user, size = "md" }: GTileProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-primary text-text font-bold",
        sizes[size],
      )}
    >
      {user.firstName?.charAt(0).toUpperCase()}
      {user.lastName?.charAt(0).toUpperCase()}
    </div>
  );
}

export { GTile };
