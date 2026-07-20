import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

export type GAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type GAvatarShape = "circle" | "square";

export interface GAvatarProps {
  firstName?: TNullable<string>;
  lastName?: TNullable<string>;
  size?: GAvatarSize;
  shape?: GAvatarShape;
  status?: UserStatusEnum;
  className?: string;
}
