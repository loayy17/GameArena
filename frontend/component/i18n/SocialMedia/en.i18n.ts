import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

const en = {
  title: "Friends Activity",
  inMatch: "in match",
  playing: "Playing Match",
  lobby: "In Lobby",
  match: "In Match",
  online: "Online",
  offline: "Offline",
  userStatus: {
    [UserStatusEnum.Online]: "Online",
    [UserStatusEnum.Offline]: "Offline",
    [UserStatusEnum.InGame]: "In Game",
  },
};

type TSocialTranslation = typeof en;
export { en, type TSocialTranslation };
