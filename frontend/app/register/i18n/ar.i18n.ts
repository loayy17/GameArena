import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const ar = {
  register: "تسجيل",
  createAccount: "قم بإنشاء حسابك وابدأ",
  fillRequiredFields: "يرجى تعبئة جميع الحقول المطلوبة",
  firstName: "الاسم الأول",
  lastName: "الاسم الأخير",
  userName: "اسم المستخدم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  createElipses: "جار إنشاء الحساب...",
  create: "إنشاء الحساب",
  haveAccount: "هل لديك حساب بالفعل؟",
  signIn: "تسجيل الدخول",
  joinUs: "انضم إلينا اليوم",
  RegisterErrorCodeEnum: {
    [ErrorCodeEnum.EmailAlreadyExists]: "البريد الإلكتروني موجود بالفعل",
  },
  goToLogin: "الذهاب إلى تسجيل الدخول",
  dynamicFieldRequired: (field: string) => `حقل ${field} مطلوب`,
  placeholder: {
    firstName: "أدخل اسمك الأول",
    lastName: "أدخل اسمك الأخير",
    userName: "أدخل اسم المستخدم الخاص بك",
    email: "أدخل بريدك الإلكتروني",
    password: "قم بإنشاء كلمة مرور",
    confirmPassword: "أعد إدخال كلمة المرور الخاصة بك",
  },
};

export { ar };
