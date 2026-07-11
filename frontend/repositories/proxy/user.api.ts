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
  },
  undefined,
  (json) => json,
);

export { userApi };
