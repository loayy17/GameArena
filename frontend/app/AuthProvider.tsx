"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { userApi } from "@/lib/user.api";
import { User } from "@/types";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}>({
  user: null,
  loading: true,
  refreshUser: async () => null,
  setUser: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const loadUser = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await userApi.profile();
      const userData = res.data as User;
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [pathname]);

  const refreshUser = async (): Promise<User | null> => {
    return await loadUser();
  };
  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
