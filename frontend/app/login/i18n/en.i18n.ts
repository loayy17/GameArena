import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const en = {
  login: "Login",
  fillRequiredFields: "Please fill in all required fields",
  invalidCredentials: "Invalid email or password",
  signIn: "Sign in",
  loggingIn: "Logging in...",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  dontHaveAccount: "Don't have an account?",
  register: "Register",
  welcomeBack: "Welcome back",
  loadingElipse: "Loading...",
  createAccount: "Create account",
  verifyEmail: "Verify Email",
  unknownError: "An unknown error occurred",
  loginDescription: "Welcome back. Please login to continue.",
  switchLanguage: (lang: string) =>
    `Switch to ${lang === "en" ? "Arabic" : "English"}`,
  loginErrorCodeEnum: {
    [ErrorCodeEnum.InvalidCredentials]: "Invalid email or password",
    [ErrorCodeEnum.Unauthorized]: "Unauthorized",
    [ErrorCodeEnum.TokenExpired]: "Token expired",
    [ErrorCodeEnum.EmailNotVerified]: "Email not verified",
    [ErrorCodeEnum.RefreshTokenInvalid]: "Refresh token invalid",
  },
  placeholder: {
    email: "Enter your email",
    password: "Enter your password",
  },
};

export { en };

export type TLoginTranslation = typeof en;
