import type { IUser } from "@/domain/meta/IUser";
import type { TPromise } from "@/types";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserService } from "../meta/IUserService";
import { userRepository } from "@/repositories/def/UserRepository";
import type { IUserRepository } from "@/repositories/meta/IUserRepository";

class UserService implements IUserService {
  constructor(private repo: IUserRepository) {}
  getById(userId: string): TPromise<IUser> {
    return this.repo.getById(userId);
  }

  profile(): TPromise<IUser> {
    return this.repo.profile();
  }

  list(data: IUserFilterRequest): TPromise<IUser[]> {
    return this.repo.list(data);
  }
}

const userService = new UserService(userRepository);

export { userService };
