"use client";

import clsx from "clsx";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import { GBadge } from "@/component/common/GBadge";

interface MatchResultBadgeProps {
  result: MatchResultEnum;
  label: string;
}

const resultVariant = {
  [MatchResultEnum.Win]: "success",
  [MatchResultEnum.Loss]: "danger",
  [MatchResultEnum.Draw]: "warning",
} as const;

function MatchResultBadge({ result, label }: MatchResultBadgeProps) {
  return (
    <GBadge variant={resultVariant[result]} size="sm">
      {label}
    </GBadge>
  );
}

export { MatchResultBadge };
