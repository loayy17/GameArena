import { userApi } from "../proxy/user.api";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserRepository } from "../meta/IUserRepository";
import type { TPromise } from "@/domain/type/TCommon";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";

class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private api = userApi.api;

  profile(): TPromise<IUser> {
    return this.api.profile();
  }

  list(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    return this.api.search(data);
  }

  updateProfile(data: IRegisterRequest): TPromise<IUser> {
    return this.api.updateProfile(data);
  }

  changePassword(data: { oldPassword: string; newPassword: string }): TPromise<unknown> {
    return this.api.changePassword(data);
  }

  getPreferences(): TPromise<string | null> {
    return this.api.getPreferences();
  }

  updatePreferences(data: { preferences: string }): TPromise<unknown> {
    return this.api.updatePreferences(data);
  }

  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }
}

export const userRepository = UserRepository.getInstance();
