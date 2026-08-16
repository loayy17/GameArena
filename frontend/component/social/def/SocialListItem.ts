import type { ReactNode } from "react";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface ISocialListItemProps {
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  userName?: TNullable<string>;
  avatarUrl?: TNullable<string>;
  status?: UserStatusEnum;
  badge?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export type { ISocialListItemProps };
