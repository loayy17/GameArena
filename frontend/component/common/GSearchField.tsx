"use client";

import { Search } from "lucide-react";

import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GTextField } from "./GTextField";
import { GIcon } from "./GIcon";

import type { TGSearchFieldProps } from "./def/GSearchField";

function GSearchField({ ref, ...props }: TGSearchFieldProps) {
  return (
    <GTextField
      {...props}
      ref={ref}
      startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
    />
  );
}

export { GSearchField };
