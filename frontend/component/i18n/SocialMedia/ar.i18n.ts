import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

const ar = {
  title: "نشاط الأصدقاء",
  inMatch: "في المباراة",
  playing: "يلعب الآن",
  lobby: "في الصالة",
  match: "في المباراة",
  online: "متصل",
  offline: "غير متصل",
  userStatus: {
    [UserStatusEnum.Online]: "متصل",
    [UserStatusEnum.Offline]: "غير متصل",
    [UserStatusEnum.InGame]: "في المباراة",
  },
};

export { ar };
