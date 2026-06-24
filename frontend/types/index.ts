// types.ts
export type TLocale = "en" | "ar";
export type TSetLocale = (locale: TLocale) => void;
export type THashMap = Record<string, unknown>;
export type TTranslate = { en: THashMap; ar: THashMap };
export type TNullable<T> = T | null;

export type Callable<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends string
      ? () => string
      : T[K] extends object
        ? Callable<T[K]>
        : never;
};

export enum GamesKindEnum {
  TicTacTao,
}

export type TFieldRegister =
  | "email"
  | "password"
  | "confirmPassword"
  | "firstName"
  | "lastName"
  | "username";
export type TFieldLogin = "email" | "password";

export interface TicTacToeGameState {
  roomId: string;
  board: string[];
  currentTurnPlayerId: string;
  winnerPlayerId?: string;
  winnerSymbol?: string;
  isFinished: boolean;
  player1Id: string;
  player1Username: string;
  player2Id?: string;
  player2Username?: string;
}

export type TError = {
  response?: {
    data?: {
      errorCode: ErrorCode;
      success: boolean;
      data?: TNullable<unknown>;
      message?: TNullable<string>;
    };
  };
  status?: number;
};

export type Validator = (value: string) => string | null;

export enum PasswordValidationEnum {
  MinLength,
  MaxLength,
  Number,
  Uppercase,
  Lowercase,
  SpecialChar,
  NoSpaces,
}

export type User = {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: number;
  createdAt: string;
  isVerified: boolean;
};

export enum ErrorCode {
  None = 0,
  InvalidCredentials = 1001,
  Unauthorized = 1002,
  TokenExpired = 1003,
  EmailNotVerified = 1004,
  RefreshTokenInvalid = 1005,
  OtpInvalid = 2001,
  OtpExpired = 2002,
  OtpAlreadyUsed = 2003,
  EmailNotFound = 2004,
  EMailAlreadyExists = 2005,
  UserNotFound = 3001,
  UserAlreadyExists = 3002,
  NoUsersFound = 3003,
  NoFriendsFound = 3004,
  ValidationError = 9001,
  ServerError = 9002,
}

export enum AuthFlowAnimationEnum {
  LOGIN = "login",
  REGISTER = "register",
  RESET_PASSWORD = "reset-password",
  EMAIL_VERIFY = "email-verify",
  VERIFY_OTP = "verify-otp",
  SET_PASSWORD = "set-password",
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  ErrorCode: ErrorCode;
  message: string;
}
