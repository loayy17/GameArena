import type { IUser } from "@/domain/meta/IUser";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { TPromise } from "@/domain/type/TCommon";

interface IUserRepository {
  getById(userId: string): TPromise<IUser>;
  profile(): TPromise<IUser>;
  list(data: IUserFilterRequest): TPromise<IUser[]>;
}
export type { IUserRepository };
