import type { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface IUserFilterRequest {
  name: TNullable<string>;
  userStatus: UserStatusEnum;
}
export type { IUserFilterRequest };
