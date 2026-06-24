// lib/chat.api.ts
import api from "@/app/network";

export const chatApi = {
  getMessages: (friendId: string) => api.get(`/chat/messages/${friendId}`),
};
