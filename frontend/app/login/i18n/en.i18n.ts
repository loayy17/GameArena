import { ErrorCode } from "@/types";

const en = {
  login: "Login",
  fillRequiredFields: "Please fill in all required fields",
  invalidCredentials: "Invalid email or password",
  signIn: "Sign in",
  loggingIn: "Logging in...",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  DontHaveAccount: "Don't have an account?",
  Register: "Register",
  ChooseYourPreferredSignInMethod: "Choose your preferred sign-in method",
  WelcomeBack: "Welcome back",
  loadingElipse: "Loading...",
  createAccount: "Create account",
  loginDescription: "Welcome back. Please login to continue.",
  switchLanguage: (lang: string) =>
    `Switch to ${lang === "en" ? "Arabic" : "English"}`,
  LoginErrorCodeEnum: {
    [ErrorCode.InvalidCredentials]: "Invalid email or password",
    [ErrorCode.Unauthorized]: "Unauthorized",
    [ErrorCode.TokenExpired]: "Token expired",
    [ErrorCode.EmailNotVerified]: "Email not verified",
    [ErrorCode.RefreshTokenInvalid]: "Refresh token invalid",
  },
};

export default en;

export type LoginTranslation = typeof en;
