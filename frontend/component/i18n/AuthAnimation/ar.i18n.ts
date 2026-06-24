import { AuthFlowAnimationEnum } from "@/types";

const ar = {
  authTitle: {
    [AuthFlowAnimationEnum.LOGIN]: "تسجيل الدخول",
    [AuthFlowAnimationEnum.REGISTER]: "إنشاء حساب",
    [AuthFlowAnimationEnum.RESET_PASSWORD]: "إعادة تعيين كلمة المرور",
    [AuthFlowAnimationEnum.SET_PASSWORD]: "تعيين كلمة المرور",
    [AuthFlowAnimationEnum.EMAIL_VERIFY]: "التحقق من البريد الإلكتروني",
    [AuthFlowAnimationEnum.VERIFY_OTP]: "التحقق من OTP",
  },
  authSubtitle: {
    [AuthFlowAnimationEnum.LOGIN]:
      "مرحبًا بعودتك! يرجى تسجيل الدخول إلى حسابك.",
    [AuthFlowAnimationEnum.REGISTER]: "قم بإنشاء حسابك وابدأ.",
    [AuthFlowAnimationEnum.RESET_PASSWORD]:
      "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك.",
    [AuthFlowAnimationEnum.SET_PASSWORD]:
      "قم بتعيين كلمة المرور الجديدة الخاصة بك.",
    [AuthFlowAnimationEnum.EMAIL_VERIFY]:
      " يرجى التحقق من بريدك الإلكتروني للتحقق.",
    [AuthFlowAnimationEnum.VERIFY_OTP]: "أدخل OTP المرسل إلى بريدك الإلكتروني.",
  },
};

export default ar;
