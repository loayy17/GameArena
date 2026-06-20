import api from "@/app/network";

interface IRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface ILogin {
  email: string;
  password: string;
}

const authApi = {
  login: (data: ILogin) => api.post("/auth/login", data),
  register: (data: IRegistration) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post("/auth/reset-password", data),
};

export { authApi };
