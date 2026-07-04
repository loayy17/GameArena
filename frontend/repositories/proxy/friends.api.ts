import { baseURL, clientFactory } from "@/app/network";

const friendsApi = clientFactory(
  `${baseURL}friend`,
  {
    sendFriendRequest: {
      verb: "post",
      template: "/request/{friendId}",
    },
    getReceivedFriendRequests: {
      verb: "get",
      template: "/requests",
    },
    getSentFriendRequests: {
      verb: "get",
      template: "/sent",
    },
    getFriends: {
      verb: "post",
      template: "/friends",
    },
    acceptFriendRequest: {
      verb: "post",
      template: "/accept/{senderId}",
    },
    rejectFriendRequest: {
      verb: "post",
      template: "/decline/{senderId}",
    },
    removeFriend: {
      verb: "post",
      template: "/remove/{friendId}",
    },
    blockUser: {
      verb: "post",
      template: "/block/{blockedId}",
    },
    unblockUser: {
      verb: "post",
      template: "/unblock/{blockedId}",
    },
  },
  undefined,
  (data) => data,
);

export { friendsApi };
