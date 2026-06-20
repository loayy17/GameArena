import api from "@/app/network";

interface ISendOpt {
  email: string;
}
interface IVerifyOtp {
  email: string;
  otp: string;
}

const emailApi = {
  sendOtp: (data: ISendOpt) => api.post(`/email-verification/send?`, data),

  verifyOtp: (data: IVerifyOtp) => api.post("/email-verification/verify", data),
};
export { emailApi };
