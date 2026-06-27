import type { IUser } from "@/domain/meta/IUser";

interface IFriendCardProps {
  user: IUser;
  onMessage: () => void;
  onInvite: () => void;
}

export type { IFriendCardProps };
