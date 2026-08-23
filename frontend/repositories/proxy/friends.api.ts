import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const friendsApi = clientFactory(
  `${baseURL}/friend`,
  {
    sendFriendRequest: {
      verb: HttpVerbEnum.Post,
      template: "/request/{receiverId}",
    },
    getReceivedFriendRequests: {
      verb: HttpVerbEnum.Get,
      template: "/requests",
    },
    getSentFriendRequests: {
      verb: HttpVerbEnum.Get,
      template: "/sent",
    },
    getFriends: {
      verb: HttpVerbEnum.Post,
      template: "/friends",
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
    getBlockedUsers: {
      verb: HttpVerbEnum.Get,
      template: "/blocked",
    },
  },
  undefined,
  (data) => data,
);

export { friendsApi };
