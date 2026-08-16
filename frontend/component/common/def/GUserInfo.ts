import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface IGUserInfoProps {
  firstName?: TNullable<string>;
  lastName?: TNullable<string>;
  userName?: TNullable<string>;
  avatarUrl?: TNullable<string>;
  status?: UserStatusEnum;
  avatarSize?: SizeEnum;
  className?: string;
}

export type { IGUserInfoProps };
