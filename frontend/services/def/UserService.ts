import { userRepository } from "@/repositories/def/UserRepository";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TPromise } from "@/domain/type/TCommon";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserService } from "../meta/IUserService";
import type { IUserRepository } from "@/repositories/meta/IUserRepository";

class UserService implements IUserService {
  constructor(private repo: IUserRepository) {}

  async profile(): TPromise<IUser> {
    const result = await this.repo.profile();
    if (result.data) result.data.fullName = (result.data.firstName || "") + " " + (result.data.lastName || "");
    return result;
  }

  async list(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.repo.list(data);
    result.data?.forEach((user) => {
      user.fullName = (user.firstName || "") + " " + (user.lastName || "");
    });
    return result;
  }
}

const userService = new UserService(userRepository);

export { userService };
