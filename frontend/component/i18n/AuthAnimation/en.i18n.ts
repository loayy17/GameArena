import { AuthFlowAnimationEnum } from "@/types";

const en = {
  authTitle: {
    [AuthFlowAnimationEnum.LOGIN]: "Login",
    [AuthFlowAnimationEnum.REGISTER]: "Register",
    [AuthFlowAnimationEnum.RESET_PASSWORD]: "Reset Password",
    [AuthFlowAnimationEnum.SET_PASSWORD]: "Set Password",
    [AuthFlowAnimationEnum.EMAIL_VERIFY]: "Verify Email",
    [AuthFlowAnimationEnum.VERIFY_OTP]: "Verify OTP",
  },
  authSubtitle: {
    [AuthFlowAnimationEnum.LOGIN]:
      "Welcome back! Please login to your account.",
    [AuthFlowAnimationEnum.REGISTER]: "Create your account and get started.",
    [AuthFlowAnimationEnum.RESET_PASSWORD]:
      "Enter your email to reset your password.",
    [AuthFlowAnimationEnum.SET_PASSWORD]: "Set your new password.",
    [AuthFlowAnimationEnum.EMAIL_VERIFY]:
      "Please check your email for verification.",
    [AuthFlowAnimationEnum.VERIFY_OTP]: "Enter the OTP sent to your email.",
  },
};

type TAuthAnimation = typeof en;
export { en, type TAuthAnimation };
