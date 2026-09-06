import { Gamepad2, MessageSquare, UserRoundCheck, UserRoundPlus } from "lucide-react";

import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

import type { LucideIcon } from "lucide-react";

const notificationTypeIcon: Record<NotificationTypeEnum, LucideIcon> = {
  [NotificationTypeEnum.FriendRequest]: UserRoundPlus,
  [NotificationTypeEnum.FriendRequestAccepted]: UserRoundCheck,
  [NotificationTypeEnum.GameInvite]: Gamepad2,
  [NotificationTypeEnum.NewMessage]: MessageSquare,
};

export { notificationTypeIcon };
