import { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/types";

interface IUserFilterRequest {
  name: TNullable<string>;
  userStatus: UserStatusEnum;
}
export type { IUserFilterRequest };
