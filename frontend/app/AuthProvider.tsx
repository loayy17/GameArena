"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "./network";

type User = {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: number;
  createdAt: string;
  isVerified: boolean;
};

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/profile");
      console.log("User profile response:", res);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/register";
    if (isAuthPage) {
      setUser(null);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    loadUser();
    return () => {
      user && setUser(null);
    };
  }, [pathname, user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
