import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const friendsApi = clientFactory(
  `${baseURL}/friend`,
  {
    sendFriendRequest: {
      verb: HttpVerbEnum.Post,
      template: "/request/{receiverId}",
    },
    acceptFriendRequest: {
      verb: HttpVerbEnum.Post,
      template: "/accept/{senderId}",
    },
    rejectFriendRequest: {
      verb: HttpVerbEnum.Post,
      template: "/decline/{senderId}",
    },
    removeFriend: {
      verb: HttpVerbEnum.Post,
      template: "/remove/{friendId}",
    },
    cancelFriendRequest: {
      verb: HttpVerbEnum.Post,
      template: "/cancel-request/{receiverId}",
    },
    blockUser: {
      verb: HttpVerbEnum.Post,
      template: "/block/{blockedId}",
    },
    unblockUser: {
      verb: HttpVerbEnum.Post,
      template: "/unblock/{blockedId}",
    },
  },
);

export { friendsApi };
