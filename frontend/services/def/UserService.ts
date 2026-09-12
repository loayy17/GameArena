import { userApi } from "@/repositories/proxy/user.api";
import { api } from "@/app/network";
import type { AxiosRequestConfig } from "axios";
import type { IUser } from "@/domain/meta/IUser";
import type { IAdminUser } from "@/domain/meta/IAdminUser";
import type { UserRoleEnum } from "@/domain/enum/UserRoleEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserPublicProfile } from "@/domain/meta/IUserPublicProfile";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { TNullable, TPromise } from "@/domain/type/TCommon";
import type { IAdminStats } from "@/domain/meta/IAdminStats";

class UserService {
  private api = userApi.api;

  async profile(): TPromise<IUser> {
    return this.api.profile<IUser>();
  }

  async list(data: IUserFilterRequest, config?: AxiosRequestConfig): TPromise<IUserSummary[]> {
    return this.api.search<IUserSummary[]>(data, config);
  }

  async publicProfile(id: string): TPromise<IUserPublicProfile> {
    return this.api.publicProfile<IUserPublicProfile>({ id });
  }

  async updateProfile(data: IRegisterRequest): TPromise<IUser> {
    return this.api.updateProfile<IUser>(data);
  }

  async changePassword(data: { oldPassword: string; newPassword: string }): TPromise<unknown> {
    return this.api.changePassword<unknown>(data);
  }

  async getPreferences(): TPromise<TNullable<string>> {
    return this.api.getPreferences<TNullable<string>>();
  }

  async updatePreferences(data: { preferences: string }): TPromise<unknown> {
    return this.api.updatePreferences<unknown>(data);
  }

  async uploadAvatar(file: File): TPromise<IUser> {
    const formData = new FormData();
    formData.append("file", file);
    const result = await api.post<IApiResponse<IUser>>("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return result.data;
  }

  async removeAvatar(): TPromise<IUser> {
    return this.api.removeAvatar<IUser>();
  }

  async getStats(config?: AxiosRequestConfig): TPromise<IAdminStats> {
    return this.api.getStats<IAdminStats>(undefined, config);
  }

  async getUsersByAdmin(data: IUserFilterRequest, config?: AxiosRequestConfig): TPromise<IAdminUser[]> {
    return this.api.getUsersByAdmin<IAdminUser[]>(data, config);
  }

  async banUser(id: string): TPromise<void> {
    return this.api.banUser<void>({ id });
  }

  async unbanUser(id: string): TPromise<void> {
    return this.api.unbanUser<void>({ id });
  }

  async setRole(id: string, role: UserRoleEnum): TPromise<void> {
    return this.api.setRole<void>({ id, role });
  }

  async deleteUser(id: string): TPromise<void> {
    return this.api.deleteUser<void>({ id });
  }
}

export const userService = new UserService();
