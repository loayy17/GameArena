import { baseURL, clientFactory } from "@/app/network";

const authProxy = clientFactory(
  `${baseURL}auth`,
  {
    login: {
      verb: "post",
      template: "/login",
    },
    register: {
      verb: "post",
      template: "/register",
    },
    logout: {
      verb: "post",
      template: "/logout",
    },
    refresh: {
      verb: "post",
      template: "/refresh",
    },
    forgotPassword: {
      verb: "post",
      template: "/forgot-password",
    },
    resetPassword: {
      verb: "post",
      template: "/reset-password",
    },
  },
  undefined,
  (data) => data,
);

export { authProxy };
