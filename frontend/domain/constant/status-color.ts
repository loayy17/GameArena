import { UserStatusEnum } from "../enum/UserStatusEnum";
import type { THashMap } from "../type/TCommon";

const statusColor: THashMap<string> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-warning",
  [UserStatusEnum.Offline]: "bg-text-muted",
  [UserStatusEnum.All]: "bg-text-muted",
};
export { statusColor };
