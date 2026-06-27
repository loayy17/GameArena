import { baseURL, clientFactory } from "@/app/network";
const emailApi = clientFactory(
  `${baseURL}email-verification`,
  {
    send: {
      verb: "post",
      template: "/send",
    },
    verify: {
      verb: "post",
      template: "/verify",
    },
  },
  undefined,
  (data) => data,
);

// {
//   send: (data: ISendOtpRequest) => api.post(`/email-verification/send?`, data),

//   verify: (data: IVerifyOtpRequest) =>
//     api.post("/email-verification/verify", data),
// };

export { emailApi };
