import { baseURL, clientFactory } from "@/app/network";

const chatApi = clientFactory(`${baseURL}chat`, {
  getMessages: { verb: "get", template: "/messages/{friendId}" },
  perFriendUnreadCounts: { verb: "get", template: "/unread/per-friend" },
});

export { chatApi };
