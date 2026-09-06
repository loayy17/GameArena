import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const emailApi = clientFactory(
  `${baseURL}/email-verification`,
  {
    send: {
      verb: HttpVerbEnum.Post,
      template: "/send",
    },
    verify: {
      verb: HttpVerbEnum.Post,
      template: "/verify",
    },
  },
);

export { emailApi };
