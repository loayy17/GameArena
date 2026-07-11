import type { TNullable } from "@/domain/type/TCommon";

export interface GAvatarProps {
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  userName: TNullable<string>;
  src?: TNullable<string>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "rounded" | "circle";
  gradient?: "brand" | "subtle-brand" | "game-green" | "game-cyan" | "game-magenta" | "play-cyan" | "play-green" | "play-magenta";
  className?: string;
}
