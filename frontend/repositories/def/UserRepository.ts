import { userApi } from "../proxy/user.api";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserRepository } from "../meta/IUserRepository";
import type { TPromise } from "@/types";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";

class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private api = userApi.api;
  getById(userId: string): TPromise<IUser> {
    return this.api.get({ id: userId });
  }

  profile(): TPromise<IUser> {
    return this.api.profile();
  }

  list(data: IUserFilterRequest): TPromise<IUser[]> {
    return this.api.search(data);
  }
  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }
}

export const userRepository = UserRepository.getInstance();
