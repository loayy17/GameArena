import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const healthApi = clientFactory(`${baseURL}/health`, {
  getHealth: {
    verb: HttpVerbEnum.Get,
    template: "",
  },
});

export { healthApi };
