import api from "@/app/network";

const userApi = {
  get: (Id: string) => api.get(`/user/${Id}`),
  getUsers: () => api.get("/user/users"),
  profile: () => api.get("/user/profile"),
  sendRequest: (receiverId: string) => api.post(`/user/request/${receiverId}`),
  acceptRequest: (senderId: string) => api.post(`/user/accept/${senderId}`),
  declineRequest: (senderId: string) => api.post(`/user/decline/${senderId}`),
  getRequests: () => api.get("/user/requests"),
  getFriends: () => api.get("/user/friends"),
  search: (query: string) => api.get("/user/search", { params: { query } }),
  getSentRequests: () => api.get("/user/sent"),
  cancelRequest: (receiverId: string) =>
    api.delete(`/user/request/${receiverId}`), // optional
};

export { userApi };
