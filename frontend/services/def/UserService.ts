import { userApi } from "@/repositories/proxy/user.api";
import { api } from "@/app/network";
import { withFullName } from "@/domain/lib/userUtils";

import type { AxiosRequestConfig } from "axios";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserPublicProfile } from "@/domain/meta/IUserPublicProfile";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { TNullable, TPromise } from "@/domain/type/TCommon";

class UserService {
  private api = userApi.api;

  async profile(): TPromise<IUser> {
    const result = await this.api.profile<IUser>();
    if (result.data) result.data = withFullName(result.data);
    return result;
  }

  async list(data: IUserFilterRequest, config?: AxiosRequestConfig): TPromise<IUserSummary[]> {
    const result = await this.api.search<IUserSummary[]>(data, config);
    if (result.data) result.data = result.data.map(withFullName);
    return result;
  }

  async publicProfile(id: string): TPromise<IUserPublicProfile> {
    const result = await this.api.publicProfile<IUserPublicProfile>({ id });
    if (result.data) {
      result.data.recentMatches = (result.data.recentMatches ?? []).map((match) => ({
        ...match,
        opponent: withFullName(match.opponent),
      }));
    }
    return result;
  }

  updateProfile(data: IRegisterRequest): TPromise<IUser> {
    return this.api.updateProfile<IUser>(data);
  }

  changePassword(data: { oldPassword: string; newPassword: string }): TPromise<unknown> {
    return this.api.changePassword<unknown>(data);
  }

  getPreferences(): TPromise<TNullable<string>> {
    return this.api.getPreferences<TNullable<string>>();
  }

  updatePreferences(data: { preferences: string }): TPromise<unknown> {
    return this.api.updatePreferences<unknown>(data);
  }

  async uploadAvatar(file: File): TPromise<IUser> {
    const formData = new FormData();
    formData.append("file", file);
    const result = await api.post<IApiResponse<IUser>>("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (result.data?.data) result.data.data = withFullName(result.data.data);
    return result.data;
  }

  removeAvatar(): TPromise<IUser> {
    return this.api.removeAvatar<IUser>();
  }
}

export const userService = new UserService();