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

export { emailApi };
