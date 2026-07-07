import type { GGradient, GSize } from "../tokens";

export interface GAvatarProps {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  src?: string | null;
  size?: GSize;
  shape?: "rounded" | "circle";
  gradient?: GGradient;
  className?: string;
}
