import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const authProxy = clientFactory(
  `${baseURL}/auth`,
  {
    login: {
      verb: HttpVerbEnum.Post,
      template: "/login",
    },
    register: {
      verb: HttpVerbEnum.Post,
      template: "/register",
    },
    logout: {
      verb: HttpVerbEnum.Post,
      template: "/logout",
    },
    refresh: {
      verb: HttpVerbEnum.Post,
      template: "/refresh",
    },
    forgotPassword: {
      verb: HttpVerbEnum.Post,
      template: "/forgot-password",
    },
    resetPassword: {
      verb: HttpVerbEnum.Post,
      template: "/reset-password",
    },
  },
  undefined,
  (data) => data,
);

export { authProxy };
