import clsx from "clsx";
import type { GLabelProps } from "./def/GLabel";

function GLabel({ required, className, children, ...props }: GLabelProps) {
  return (
    <label
      className={clsx("block text-sm font-medium text-text-secondary", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger ms-0.5" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

export { GLabel };
