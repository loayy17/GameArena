import { clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const matchHistoryApi = clientFactory(`/matchhistory`, {
  getMatchHistory: {
    verb: HttpVerbEnum.Get,
    template: "",
  },
});

export { matchHistoryApi };
