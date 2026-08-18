import type { IUser } from "@/domain/meta/IUser";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { TNullable } from "@/domain/type/TCommon";

interface AuthContextType {
  user: TNullable<IUser>;
  loading: boolean;
  requireAuth: boolean;
  updatePreferences: (newPreferences: Partial<IUserPreferences>) => void;
  refreshUser: () => Promise<TNullable<IUser>>;
  setUser: (user: TNullable<IUser>) => void;
}
export type { AuthContextType };
