import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

import type { THashMap } from "@/domain/type/TCommon";

const en: THashMap<string, number> = {
  [ErrorCodeEnum.InvalidCredentials]: "Invalid email or password",
  [ErrorCodeEnum.Unauthorized]: "Unauthorized",
  [ErrorCodeEnum.TokenExpired]: "Session expired. Please log in again",
  [ErrorCodeEnum.EmailNotVerified]: "Email not verified",
  [ErrorCodeEnum.RefreshTokenInvalid]: "Invalid refresh token",
  [ErrorCodeEnum.UserBanned]: "This account has been banned",
  [ErrorCodeEnum.Forbidden]: "You are not allowed to perform this action",
  [ErrorCodeEnum.OtpInvalid]: "Invalid verification code",
  [ErrorCodeEnum.OtpExpired]: "Verification code expired. Please request a new one",
  [ErrorCodeEnum.EmailNotFound]: "Email not found",
  [ErrorCodeEnum.EmailAlreadyExists]: "Email already registered",
  [ErrorCodeEnum.EmailAlreadyVerified]: "Email is already verified",
  [ErrorCodeEnum.UsernameAlreadyExists]: "Username is already used",
  [ErrorCodeEnum.RateLimited]: "Too many attempts. Please wait a moment",
  [ErrorCodeEnum.UserNotFound]: "User not found",
  [ErrorCodeEnum.RequestAlreadyExists]: "Friend request already sent",
  [ErrorCodeEnum.AlreadyFriends]: "Already friends",
  [ErrorCodeEnum.ReceiverHasAlreadySentRequest]: "This user already sent you a request",
  [ErrorCodeEnum.FriendRequestNotFound]: "Friend request not found",
  [ErrorCodeEnum.IsNotFriend]: "Not friends with this user",
  [ErrorCodeEnum.AlreadyBlocked]: "User already blocked",
  [ErrorCodeEnum.NotBlocked]: "User is not blocked",
  [ErrorCodeEnum.CannotSelfBlock]: "Cannot block yourself",
  [ErrorCodeEnum.UserBlockedYou]: "This user has blocked you",
  [ErrorCodeEnum.YouBlockedUser]: "You have blocked this user",
  [ErrorCodeEnum.RequestAlreadyProcessed]: "Friend request already processed",
  [ErrorCodeEnum.RoomNotFound]: "Game room not found",
  [ErrorCodeEnum.PlayerNotFound]: "Player not found",
  [ErrorCodeEnum.InvalidGameType]: "Invalid game type",
  [ErrorCodeEnum.InvalidRoomId]: "Invalid room ID",
  [ErrorCodeEnum.InvalidRequest]: "Invalid request",
  [ErrorCodeEnum.ValidationError]: "Validation error",
  [ErrorCodeEnum.ServerError]: "Server error. Please try again",
};
type TErrorMessages = typeof en;
export { en };
export type { TErrorMessages };
