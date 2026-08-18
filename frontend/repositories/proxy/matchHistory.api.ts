import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const matchHistoryApi = clientFactory(
  `${baseURL}/MatchHistory`,
  {
    getMatchHistory: {
      verb: HttpVerbEnum.Get,
      template: "",
    },
  },
  undefined,
  (data) => data,
);

export { matchHistoryApi };
