"use client";

import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import { GButton } from "./GButton";
import { GIcon } from "./GIcon";
import { GModal } from "./GModal";

import type { IGConfirmDialogProps } from "./def/GConfirmDialog";

function GConfirmDialog({ open, icon, iconColor = AccentColorEnum.Danger, title, description, confirmLabel, cancelLabel, confirmVariant = ButtonVariantEnum.Danger, busy = false, onConfirm, onClose }: IGConfirmDialogProps) {
  return (
    <GModal open={open} onClose={onClose} role="alertdialog" ariaLabel={title}>
      <div className="text-center">
        <GIcon icon={icon} size={SizeEnum.lg} color={iconColor} className="mx-auto mb-4" />
        <h2 className="mb-2 text-xl font-bold text-text">{title}</h2>
        <p className="mb-6 text-sm text-text-secondary">{description}</p>
        <div className="flex gap-3">
          <GButton variant={ButtonVariantEnum.Secondary} onClick={onClose} disabled={busy} className="w-full">
            {cancelLabel}
          </GButton>
          <GButton variant={confirmVariant} loading={busy} onClick={onConfirm} className="w-full">
            {confirmLabel}
          </GButton>
        </div>
      </div>
    </GModal>
  );
}

export { GConfirmDialog };
