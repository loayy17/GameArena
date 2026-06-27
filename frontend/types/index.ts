import type { IApiResponse } from "@/domain/meta/IApiResponse";
import { IGameInvite } from "@/domain/meta/INotification";
import {
  Orbit,
  Puzzle,
  Swords,
  Home,
  Users,
  Gamepad2,
  History,
  UserCircle,
  Settings,
  MessageSquare,
} from "lucide-react";
// usage

// types.ts
export type TLocale = "en" | "ar";
export type TTheme = "light" | "dark";
export type TSetLocale = (locale: TLocale) => void;
export type TSetTheme = (theme: TTheme) => void;
export type THashMap<T = unknown> = Record<string, T>;
export type TTranslate = { en: THashMap; ar: THashMap };
export type TNullable<T> = T | null;
export type TClass<T> = new (...args: unknown[]) => T;
export type TEndpointsMap = THashMap<TEndpoint>;
export type TEndpoint = {
  verb: "get" | "post" | "put" | "delete";
  template: string;
};
export type TPromise<T> = Promise<IApiResponse<T>>;

export type TProxy<T extends TEndpointsMap> = {
  [K in keyof T]: <TResult = unknown, TReq = unknown>(
    payload?: TReq,
  ) => TPromise<TResult>;
};

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

export type Validator = (value: string) => string | null;
export type TGameInvitePayload = IGameInvite;
export type TFriendRequestPayload = {
  senderId: string;
  receiverId: string;
};
export type TChatNotificationPayload = {
  senderId: string;
  receiverId: string;
  content?: string | null;
  sentAt: string | Date;
  isRead?: boolean;
};
export const navItems = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "friends", labelKey: "friends", icon: Users, badge: "friends" },
  {
    id: "messages",
    labelKey: "messages",
    icon: MessageSquare,
    badge: "messages",
  },
  { id: "games", labelKey: "games", icon: Gamepad2 },
  { id: "history", labelKey: "history", icon: History },
  { id: "profile", labelKey: "profile", icon: UserCircle },
  { id: "settings", labelKey: "settings", icon: Settings },
];

export const games = [
  {
    name: "Snake",
    path: "/snake",
    desc: "Classic arcade — eat & survive",
    icon: Orbit,
    gradient: "from-emerald-400 via-neon-green to-emerald-300",
    color: "text-neon-green",
  },
  {
    name: "Tic Tac Toe",
    path: "/tic-tac-toe",
    desc: "3×3 tactical duel",
    icon: Puzzle,
    gradient: "from-cyan-400 via-neon-cyan to-cyan-300",
    color: "text-neon-cyan",
  },
  {
    name: "Pong",
    path: "/pong",
    desc: "Retro table tennis",
    icon: Swords,
    gradient: "from-violet-400 via-neon-magenta to-violet-300",
    color: "text-neon-magenta",
  },
];
export enum PasswordValidationEnum {
  MinLength,
  MaxLength,
  Number,
  Uppercase,
  Lowercase,
  SpecialChar,
  NoSpaces,
}

// EMPTY_GUID
export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5",
  lg: "h-12 px-6 text-lg",
};

export enum AuthFlowAnimationEnum {
  LOGIN = "login",
  REGISTER = "register",
  RESET_PASSWORD = "reset-password",
  EMAIL_VERIFY = "email-verify",
  VERIFY_OTP = "verify-otp",
  SET_PASSWORD = "set-password",
}
