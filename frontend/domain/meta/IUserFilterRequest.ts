import type { UserRoleEnum } from "../enum/UserRoleEnum";
import type { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface IUserFilterRequest {
  name: TNullable<string>;
  userStatus: UserStatusEnum;
  userRole: UserRoleEnum;
}
export type { IUserFilterRequest };
