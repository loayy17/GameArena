import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import type { IAuthFrameProps } from "./def/AuthFrame";

function AuthFrame({ icon, title, description, backLabel, children }: IAuthFrameProps) {
  return (
    <div className="w-full space-y-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
          <GIcon icon={icon} size={SizeEnum.xl} color={AccentColorEnum.Primary} />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-text-muted">{description}</p>}
        </div>
      </div>

      {children}

      {backLabel && (
        <div className="pt-2 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary">
            <GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />
            {backLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

export { AuthFrame };
