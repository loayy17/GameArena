import { UserRoleEnum } from "../enum/UserRoleEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IUserSummary } from "./IUserSummary";

interface IUser extends IUserSummary {
  email: TNullable<string>;
  role: UserRoleEnum;
  createdAt: Date;
  isVerified: boolean;
  preferences?: string;
}
export type { IUser };
