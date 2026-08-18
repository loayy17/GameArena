"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { userService } from "@/services/def/UserService";
import type { IUser } from "@/domain/meta/IUser";
import type { TNullable } from "@/domain/type/TCommon";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";

import type { AuthContextType } from "./def/IAuthContext";

const AuthContext = createContext<TNullable<AuthContextType>>(null);

export function AuthProvider({ requireAuth, children }: { requireAuth: boolean; children: React.ReactNode }) {
  const [user, setUser] = useState<TNullable<IUser>>(null);

  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<TNullable<IUser>> => {
    try {
      const response = await userService.profile();

      const userData = response.data ?? null;

      setUser(userData);

      return userData;
    } catch {
      setUser(null);

      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await loadUser();

      if (!cancelled) {
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
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

  const updatePreferences = useCallback((newPreferences: Partial<IUserPreferences>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }
      const currentPreferences = JSON.parse(currentUser.preferences ?? "{}");
      const preferences = {
        ...currentPreferences,
        ...newPreferences,
      };
      return {
        ...currentUser,
        preferences: JSON.stringify(preferences),
      };
    });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      requireAuth,
      refreshUser,
      updatePreferences,
      setUser,
    }),
    [user, loading, requireAuth, refreshUser, updatePreferences],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
