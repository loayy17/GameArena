import type { TNullable } from "@/domain/type/TCommon";

export interface GAvatarProps {
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  userName: TNullable<string>;
  src?: TNullable<string>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "rounded" | "circle";
  gradient?: string;
  className?: string;
}
