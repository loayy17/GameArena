import { ErrorCode } from "@/types";

const ar = {
  register: "تسجيل",
  createAccount: "قم بإنشاء حسابك وابدأ",
  fillRequiredFields: "يرجى تعبئة جميع الحقول المطلوبة",
  firstName: "الاسم الأول",
  firstNamePlaceholder: "أدخل اسمك الأول",
  lastName: "الاسم الأخير",
  lastNamePlaceholder: "أدخل اسمك الأخير",
  username: "اسم المستخدم",
  usernamePlaceholder: "أدخل اسم المستخدم الخاص بك",
  email: "البريد الإلكتروني",
  emailPlaceholder: "أدخل بريدك الإلكتروني",
  password: "كلمة المرور",
  passwordPlaceholder: "قم بإنشاء كلمة مرور",
  confirmPassword: "تأكيد كلمة المرور",
  confirmPasswordPlaceholder: "أعد إدخال كلمة المرور الخاصة بك",
  createElipses: "جار إنشاء الحساب...",
  create: "إنشاء الحساب",
  haveAccount: "هل لديك حساب بالفعل؟",
  signIn: "تسجيل الدخول",
  joinUs: "انضم إلينا اليوم",
  RegisterErrorCodeEnum: {
    [ErrorCode.EMailAlreadyExists]: "البريد الإلكتروني موجود بالفعل",
  },
  goToLogin: "الذهاب إلى تسجيل الدخول",
  dynamicFieldRequired: (field: string) => `حقل ${field} مطلوب`,
};

export default ar;
