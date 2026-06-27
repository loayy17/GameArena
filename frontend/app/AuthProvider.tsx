"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { IUser } from "@/domain/meta/IUser";
import { userService } from "@/services/def/UserService";

/* ---------------- TYPES ---------------- */

type AuthContextType = {
  user: IUser | null;
  loading: boolean;
  refreshUser: () => Promise<IUser | null>;
  setUser: (user: IUser | null) => void;
};

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<IUser | null> => {
    try {
      const res = await userService.profile();

      const userData = res.data ?? null;

      setUser(userData);

      return userData;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await userService.profile();
        if (!ignore) setUser(res.data ?? null);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------------- REFRESH ---------------- */

  const refreshUser = useCallback(async () => {
    setLoading(true);

    try {
      return await loadUser();
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  /* ---------------- CONTEXT VALUE ---------------- */

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      refreshUser,
      setUser,
    }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------- HOOK ---------------- */

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
