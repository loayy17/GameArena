"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { userService } from "@/services/def/UserService";
import type { IUser } from "@/domain/meta/IUser";
import type { TNullable } from "@/domain/type/TCommon";
import { AuthContextType } from "./def/IAuthContext";

const AuthContext = createContext<TNullable<AuthContextType>>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TNullable<IUser>>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<TNullable<IUser>> => {
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

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      await loadUser();
      if (!ignore) setLoading(false);
    };

    void init();

    return () => {
      ignore = true;
    };
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      return await loadUser();
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
