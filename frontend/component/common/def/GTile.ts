import type { IFriend } from "@/domain/meta/ICommon";
import type { IUser } from "@/domain/meta/IUser";

interface GTileProps {
  user: IUser | IFriend;
  size?: "sm" | "md" | "lg";
}
export type { GTileProps };
