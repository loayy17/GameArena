"use client";

import { useEffect } from "react";

import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useLogout } from "@/hooks/useLogout";

export default function LogoutPage() {
  const logout = useLogout();

  useEffect(() => {
    void logout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <GSpinner size={SizeEnum.lg} ariaLabel="Signing out" />
    </div>
  );
}
