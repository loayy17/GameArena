"use client";

import { GModal } from "./GModal";
import { GIcon } from "./GIcon";
import { GButton } from "./GButton";
import { GButtonAsync } from "./GButtonAsync";
import type { IGConfirmDialogProps } from "./def/GConfirmDialog";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

function GConfirmDialog({
  open,
  icon,
  iconColor = AccentColorEnum.Danger,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = ButtonVariantEnum.Danger,
  busy = false,
  onConfirm,
  onClose,
}: IGConfirmDialogProps) {
  return (
    <GModal open={open} onClose={onClose} role="alertdialog" ariaLabel={title}>
      <div className="text-center">
        <GIcon icon={icon} size={SizeEnum.lg} color={iconColor} className="mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text mb-2">{title}</h2>
        <p className="text-sm text-text-secondary mb-6">{description}</p>
        <div className="flex gap-3">
          <GButton variant={ButtonVariantEnum.Secondary} fullWidth onClick={onClose} disabled={busy}>
            {cancelLabel}
          </GButton>
          <GButtonAsync variant={confirmVariant} fullWidth onClick={onConfirm} busy={busy}>
            {confirmLabel}
          </GButtonAsync>
        </div>
      </div>
    </GModal>
  );
}

export { GConfirmDialog };
