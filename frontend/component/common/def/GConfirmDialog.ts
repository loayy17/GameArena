import type { LucideIcon } from "lucide-react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

interface IGConfirmDialogProps {
  open: boolean;
  icon: LucideIcon;
  iconColor?: AccentColorEnum;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant?: ButtonVariantEnum;
  busy?: boolean;
  onConfirm: () => void | Promise<unknown>;
  onClose: () => void;
}

export type { IGConfirmDialogProps };
