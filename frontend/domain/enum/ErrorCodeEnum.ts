enum ErrorCodeEnum {
  None = 0,

  // Auth
  InvalidCredentials = 1001,
  Unauthorized = 1002,
  TokenExpired = 1003,
  EmailNotVerified = 1004,
  RefreshTokenInvalid = 1005,

  // Email
  OtpInvalid = 2001,
  OtpExpired = 2002,
  OtpAlreadyUsed = 2003,
  EmailNotFound = 2004,
  EmailAlreadyExists = 2005,
  EmailAlreadyVerified = 2006,
  OtpGenerationFailed = 2007,

  // User
  UserNotFound = 3001,
  UserAlreadyExists = 3002,
  NoUsersFound = 3003,
  NoFriendsFound = 3004,

  // Friend
  RequestAlreadyExists = 4001,
  AlreadyFriends = 4002,
  ReceiverHasAlreadySentRequest = 4003,
  FriendRequestNotFound = 4004,
  IsNotFriend = 4005,

  // Game
  RoomNotFound = 5001,
  PlayerNotFound = 5002,
  MatchSaveFailed = 5003,
  InvalidGameType = 5004,
  InvalidRoomId = 5005,

  // Validation
  InvalidRequest = 6001,

  // General
  ValidationError = 9001,
  ServerError = 9002,
}
export { ErrorCodeEnum };
