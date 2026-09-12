import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const userApi = clientFactory(
  `${baseURL}/user`,
  {
    profile: {
      verb: HttpVerbEnum.Get,
      template: "/profile",
    },
    publicProfile: {
      verb: HttpVerbEnum.Get,
      template: "/{id}",
    },
    search: {
      verb: HttpVerbEnum.Post,
      template: "/search",
    },
    updateProfile: {
      verb: HttpVerbEnum.Put,
      template: "/update-profile",
    },
    changePassword: {
      verb: HttpVerbEnum.Put,
      template: "/change-password",
    },
    getPreferences: {
      verb: HttpVerbEnum.Get,
      template: "/preferences",
    },
    updatePreferences: {
      verb: HttpVerbEnum.Put,
      template: "/preferences",
    },
    removeAvatar: {
      verb: HttpVerbEnum.Delete,
      template: "/avatar",
    },
    getStats: {
      verb: HttpVerbEnum.Get,
      template: "/admin/stats",
    },
    getUsersByAdmin: {
      verb: HttpVerbEnum.Get,
      template: "/admin/users",
    },
    banUser: {
      verb: HttpVerbEnum.Post,
      template: "/admin/users/{id}/ban",
    },
    unbanUser: {
      verb: HttpVerbEnum.Post,
      template: "/admin/users/{id}/unban",
    },
    setRole: {
      verb: HttpVerbEnum.Put,
      template: "/admin/users/role",
    },
    deleteUser: {
      verb: HttpVerbEnum.Delete,
      template: "/admin/users/{id}",
    },
  },
  undefined,
  (json) => json,
);

export { userApi };
