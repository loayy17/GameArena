import { clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const emailApi = clientFactory(`/email-verification`, {
  send: {
    verb: HttpVerbEnum.Post,
    template: "/send",
  },
  verify: {
    verb: HttpVerbEnum.Post,
    template: "/verify",
  },
});

export { emailApi };
