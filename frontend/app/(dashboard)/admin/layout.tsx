"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/app/providers/AuthProvider";
import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { UserRoleEnum } from "@/domain/enum/UserRoleEnum";

import type { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const isStaff = user?.role === UserRoleEnum.Admin || user?.role === UserRoleEnum.Moderator || user?.role === UserRoleEnum.SuperAdmin;

  useEffect(() => {
    if (!loading && !redirectedRef.current && (!user || !isStaff)) {
      redirectedRef.current = true;
      router.replace("/home");
    }
  }, [loading, user, isStaff, router]);

  if (loading || !user || !isStaff) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminLayout;
