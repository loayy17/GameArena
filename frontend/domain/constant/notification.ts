import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

const NOTIFICATION_TYPE_BY_CODE: Record<number, NotificationTypeEnum> = {
    0: NotificationTypeEnum.FriendRequest,
    1: NotificationTypeEnum.FriendRequestAccepted,
    2: NotificationTypeEnum.GameInvite,
    3: NotificationTypeEnum.NewMessage,
};

const TOAST_DURATION_MS = 6000;

export { NOTIFICATION_TYPE_BY_CODE, TOAST_DURATION_MS };

