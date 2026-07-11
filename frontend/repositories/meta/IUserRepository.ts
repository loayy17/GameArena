import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { TPromise } from "@/domain/type/TCommon";

interface IUserRepository {
  profile(): TPromise<IUser>;
  list(data: IUserFilterRequest): TPromise<IUserSummary[]>;
  updateProfile(data: IRegisterRequest): TPromise<IUser>;
}
export type { IUserRepository };
