import { ErrorCode } from "@/types";

const en = {
  register: "Register",
  createAccount: "Create your account and get started",
  fillRequiredFields: "Please fill in all required fields",
  firstName: "First Name",
  firstNamePlaceholder: "Enter your first name",
  lastName: "Last Name",
  lastNamePlaceholder: "Enter your last name",
  username: "Username",
  usernamePlaceholder: "Enter your username",
  email: "Email",
  emailPlaceholder: "Enter your email",
  password: "Password",
  passwordPlaceholder: "Create a password",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Re-enter your password",
  createElipses: "Creating account...",
  create: "Create account",
  haveAccount: "Already have an account?",
  signIn: "Sign in",
  joinUs: "Join Us Today",
  RegisterErrorCodeEnum: {
    [ErrorCode.EMailAlreadyExists]: "Email already exists",
  },
  goToLogin: "Go to Login",
  dynamicFieldRequired: (field: string) => `${field} is required`,
};

export default en;

export type TRegisterTranslation = typeof en;
