import { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface IUserSummary {
  id: string;
  userName: TNullable<string>;
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  status?: UserStatusEnum;
  fullName?: TNullable<string>;
}
export type { IUserSummary };
