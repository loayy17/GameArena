import type { ReactNode } from "react";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGUserRowProps {
  user: IUserSummary;
  size?: SizeEnum;
  query?: string;
  unreadCount?: number;
  userNameFallback?: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  className?: string;
}

export type { IGUserRowProps };
