import { clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const chatApi = clientFactory(`/chat`, {
  getMessages: { verb: HttpVerbEnum.Get, template: "/messages/{friendId}" },
  perFriendUnreadCounts: { verb: HttpVerbEnum.Get, template: "/unread/per-friend" },
});

export { chatApi };
