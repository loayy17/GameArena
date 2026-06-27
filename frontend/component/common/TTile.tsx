import clsx from "clsx";
import { sizes } from "@/types";
import type { TTileProps } from "./def/TTile";

// this component is used for show the user nicknake First name letter and last name letter b in a circle with a background color
function TTile({ user, size = "md" }: TTileProps) {
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

export { TTile };
