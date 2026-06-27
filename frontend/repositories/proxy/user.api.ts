import { baseURL, clientFactory } from "@/app/network";

const userApi = clientFactory(
  `${baseURL}user`,
  {
    get: {
      verb: "get",
      template: "/{id}",
    },
    profile: {
      verb: "get",
      template: "/profile",
    },
    search: {
      verb: "post",
      template: "/search",
    },
  },
  undefined,
  (json) => json,
);

export { userApi };
