import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { TPromise } from "@/domain/type/TCommon";

interface IUserService {
  profile(): TPromise<IUser>;
  list(data: IUserFilterRequest): TPromise<IUserSummary[]>;
}
export type { IUserService };
