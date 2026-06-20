import { CSSProperties, MouseEvent } from "react";

type TButtonProps = {
  title: string;

  type?: "button" | "submit" | "reset";

  disabled?: boolean;
  loading?: boolean;
  required?: boolean;

  className?: string;
  style?: CSSProperties;

  validationMessage?: string;

  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type { TButtonProps };
