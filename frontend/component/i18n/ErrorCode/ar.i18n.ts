import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

import type { THashMap } from "@/domain/type/TCommon";

const ar: THashMap<string, number> = {
  [ErrorCodeEnum.InvalidCredentials]: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  [ErrorCodeEnum.Unauthorized]: "غير مصرح",
  [ErrorCodeEnum.TokenExpired]: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
  [ErrorCodeEnum.EmailNotVerified]: "البريد الإلكتروني غير مؤكد",
  [ErrorCodeEnum.RefreshTokenInvalid]: "رمز التحديث غير صالح",
  [ErrorCodeEnum.OtpInvalid]: "رمز التحقق غير صحيح",
  [ErrorCodeEnum.OtpExpired]: "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد",
  [ErrorCodeEnum.EmailNotFound]: "البريد الإلكتروني غير موجود",
  [ErrorCodeEnum.EmailAlreadyExists]: "البريد الإلكتروني مسجل بالفعل",
  [ErrorCodeEnum.EmailAlreadyVerified]: "البريد الإلكتروني مؤكد بالفعل",
  [ErrorCodeEnum.UsernameAlreadyExists]: "اسم المستخدم مستخدم بالفعل",
  [ErrorCodeEnum.RateLimited]: "طلبات كثيرة جداً. يرجى الانتظار قليلاً",
  [ErrorCodeEnum.UserNotFound]: "المستخدم غير موجود",
  [ErrorCodeEnum.RequestAlreadyExists]: "طلب الصداقة مرسل بالفعل",
  [ErrorCodeEnum.AlreadyFriends]: "أنت أصدقاء بالفعل",
  [ErrorCodeEnum.ReceiverHasAlreadySentRequest]: "هذا المستخدم أرسل لك طلباً بالفعل",
  [ErrorCodeEnum.FriendRequestNotFound]: "طلب الصداقة غير موجود",
  [ErrorCodeEnum.IsNotFriend]: "لست صديق مع هذا المستخدم",
  [ErrorCodeEnum.AlreadyBlocked]: "المستخدم محظور بالفعل",
  [ErrorCodeEnum.NotBlocked]: "المستخدم غير محظور",
  [ErrorCodeEnum.CannotSelfBlock]: "لا يمكنك حظر نفسك",
  [ErrorCodeEnum.UserBlockedYou]: "هذا المستخدم حظرك",
  [ErrorCodeEnum.YouBlockedUser]: "لقد قمت بحظر هذا المستخدم",
  [ErrorCodeEnum.RequestAlreadyProcessed]: "تمت معالجة طلب الصداقة بالفعل",
  [ErrorCodeEnum.RoomNotFound]: "غرفة اللعب غير موجودة",
  [ErrorCodeEnum.PlayerNotFound]: "اللاعب غير موجود",
  [ErrorCodeEnum.InvalidGameType]: "نوع لعبة غير صالح",
  [ErrorCodeEnum.InvalidRoomId]: "معرف الغرفة غير صالح",
  [ErrorCodeEnum.InvalidRequest]: "طلب غير صالح",
  [ErrorCodeEnum.ValidationError]: "خطأ في التحقق",
  [ErrorCodeEnum.ServerError]: "خطأ في الخادم. يرجى المحاولة مرة أخرى",
};

export { ar };
