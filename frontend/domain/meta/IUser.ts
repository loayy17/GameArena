import { UserRoleEnum } from "../enum/UserRoleEnum";
import { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/types";

interface IUser {
  id: string;
  userName: TNullable<string>;
  email: TNullable<string>;
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  fullName?: TNullable<string>;
  role: UserRoleEnum;
  status: UserStatusEnum;
  createdAt: Date;
  isVerified: boolean;
}
export type { IUser };
