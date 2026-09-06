"use client";

import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <GSpinner size={SizeEnum.lg} ariaLabel="Loading" />
    </div>
  );
}
