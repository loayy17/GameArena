import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

interface IFriend {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  status: UserStatusEnum;
}

export type { IFriend };
