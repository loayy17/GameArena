import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const ar = {
  login: "تسجيل الدخول",
  fillRequiredFields: "يرجى تعبئة جميع الحقول المطلوبة",
  invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  loggingIn: "جار تسجيل الدخول...",
  signIn: "تسجيل الدخول",
  email: "البريد الإلكتروني",
  emailPlaceholder: "أدخل بريدك الإلكتروني",
  password: "كلمة المرور",
  passwordPlaceholder: "أدخل كلمة المرور الخاصة بك",
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
    [ErrorCodeEnum.InvalidCredentials]:
      "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    [ErrorCodeEnum.Unauthorized]: "غير مصرح",
    [ErrorCodeEnum.TokenExpired]: "انتهت صلاحية الرمز",
    [ErrorCodeEnum.EmailNotVerified]: "البريد الإلكتروني غير مؤكد",
    [ErrorCodeEnum.RefreshTokenInvalid]: "رمز التحديث غير صالح",
  },
};

export { ar };
