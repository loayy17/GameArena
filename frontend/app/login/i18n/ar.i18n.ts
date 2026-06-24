import { ErrorCode } from "@/types";

const ar = {
  login: "تسجيل الدخول",
  fillRequiredFields: "يرجى تعبئة جميع الحقول المطلوبة",
  invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  loggingIn: "جار تسجيل الدخول...",
  signIn: "تسجيل الدخول",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  forgotPassword: "نسيت كلمة المرور؟",
  dontHaveAccount: "ليس لديك حساب؟",
  register: "تسجيل",
  welcomeBack: "مرحباً بك",
  loadingElipse: "جار التحميل...",
  createAccount: "إنشاء حساب",
  verifyEmail: "تأكيد البريد الإلكتروني",
  loginDescription: "مرحبًا بعودتك. يرجى تسجيل الدخول للمتابعة.",
  switchLanguage: (lang: string) =>
    `التبديل إلى ${lang === "en" ? "العربية" : "الإنجليزية"}`,
  loginErrorCodeEnum: {
    [ErrorCode.InvalidCredentials]:
      "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    [ErrorCode.Unauthorized]: "غير مصرح",
    [ErrorCode.TokenExpired]: "انتهت صلاحية الرمز",
    [ErrorCode.EmailNotVerified]: "البريد الإلكتروني غير مؤكد",
    [ErrorCode.RefreshTokenInvalid]: "رمز التحديث غير صالح",
  },
};

export default ar;
