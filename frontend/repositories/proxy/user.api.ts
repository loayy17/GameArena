import { baseURL, clientFactory } from "@/app/network";

const userApi = clientFactory(
  `${baseURL}user`,
  {
    profile: {
      verb: "get",
      template: "/profile",
    },
    search: {
      verb: "post",
      template: "/search",
    },
    updateProfile: {
      verb: "put",
      template: "/update-profile",
    },
    changePassword: {
      verb: "put",
      template: "/change-password",
    },
    getPreferences: {
      verb: "get",
      template: "/preferences",
    },
    updatePreferences: {
      verb: "put",
      template: "/preferences",
    },
  },
  undefined,
  (json) => json,
);

export { userApi };
