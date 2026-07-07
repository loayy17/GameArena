import type { IUser } from "@/domain/meta/IUser";
import type { GSize } from "./tokens";

interface GTileProps {
  user: IUser;
  size?: GSize;
}

export type { GTileProps };
