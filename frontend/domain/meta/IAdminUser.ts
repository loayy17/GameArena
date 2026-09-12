import type { UserRoleEnum } from "../enum/UserRoleEnum";
import type { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "../type/TCommon";

interface IAdminUser {
  id: string;
  userName: TNullable<string>;
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  fullName: TNullable<string>;
  email: TNullable<string>;
  role: UserRoleEnum;
  isBanned: boolean;
  status?: UserStatusEnum;
  avatarUrl?: TNullable<string>;
}

export type { IAdminUser };
