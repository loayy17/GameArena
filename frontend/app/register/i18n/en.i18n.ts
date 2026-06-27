import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const en = {
  register: "Register",
  createAccount: "Create your account and get started",
  fillRequiredFields: "Please fill in all required fields",
  firstName: "First Name",
  lastName: "Last Name",
  userName: "Username",
  email: "Email",
  password: "Password",
  createElipses: "Creating account...",
  create: "Create account",
  haveAccount: "Already have an account?",
  signIn: "Sign in",
  joinUs: "Join Us Today",
  unknownError: "An unknown error occurred",
  RegisterErrorCodeEnum: {
    [ErrorCodeEnum.EmailAlreadyExists]: "Email already exists",
  },
  goToLogin: "Go to Login",
  dynamicFieldRequired: (field: string) => `${field} is required`,
  placeholder: {
    firstName: "Enter your first name",
    lastName: "Enter your last name",
    userName: "Enter your username",
    email: "Enter your email",
    password: "Create a password",
    confirmPassword: "Re-enter your password",
  },
};

type TRegisterTranslation = typeof en;
export { en, type TRegisterTranslation };
