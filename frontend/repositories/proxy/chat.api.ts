import { baseURL, clientFactory } from "@/app/network";

const chatApi = clientFactory(`${baseURL}chat`, {
  getMessages: {
    verb: "get",
    template: "/messages/{friendId}",
  },
  getUnreadCount: {
    verb: "get",
    template: "/unreadMessages/count",
  },
});

export { chatApi };
