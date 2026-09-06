import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

export interface IGAvatarUser {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  status?: UserStatusEnum | null;
}

export interface IGAvatarProps {
  user?: IGAvatarUser | null;
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: SizeEnum;
  status?: UserStatusEnum | null;
  className?: string;
}
