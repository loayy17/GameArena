"use client";

import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";

export default function Loading() {
  return (
    <div className="flex min-h-half-viewport items-center justify-center">
      <GSpinner size={SizeEnum.lg} ariaLabel="Loading" />
    </div>
  );
}
