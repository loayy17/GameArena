import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const matchHistoryApi = clientFactory(
  `${baseURL}/matchhistory`,
  {
    getMatchHistory: {
      verb: HttpVerbEnum.Get,
      template: "",
    },
  },
);

export { matchHistoryApi };
