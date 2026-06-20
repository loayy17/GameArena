import api from "@/app/network";

const userApi = {
  get: (Id: string) => api.get(`/user/${Id}`),
  getFriends: (Id: string) => api.get(`/user/getfriend/${Id}`),
  getUsers: () => api.get("/user/users"),
  profile: () => api.get("/user/profile"),
};

export { userApi };
