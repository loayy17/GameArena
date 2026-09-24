import { clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const healthApi = clientFactory(`/health`, {
  getHealth: {
    verb: HttpVerbEnum.Get,
    template: "",
  },
});

export { healthApi };
