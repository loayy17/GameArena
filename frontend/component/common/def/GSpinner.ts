import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

export interface IGSpinnerProps {
  size?: SizeEnum;
  color?: AccentColorEnum;
  className?: string;
  ariaLabel?: string;
}
