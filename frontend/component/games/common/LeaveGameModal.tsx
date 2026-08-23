"use client";

import { ArrowRightFromLine } from "lucide-react";

import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { ILeaveGameModalProps } from "./def/LeaveGameModal";

function LeaveGameModal({ open, title, description, cancelLabel, confirmLabel, onCancel, onConfirm }: ILeaveGameModalProps) {
  return (
    <GConfirmDialog
      open={open}
      icon={ArrowRightFromLine}
      iconColor={AccentColorEnum.Warning}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      onClose={onCancel}
    />
  );
}

export { LeaveGameModal };
