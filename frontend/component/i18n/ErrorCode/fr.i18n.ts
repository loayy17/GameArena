import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { THashMap } from "@/domain/type/TCommon";

const fr: THashMap<string, number> = {
  [ErrorCodeEnum.InvalidCredentials]: "E-mail ou mot de passe invalide",
  [ErrorCodeEnum.Unauthorized]: "Non autorisé",
  [ErrorCodeEnum.TokenExpired]: "Session expirée. Veuillez vous reconnecter",
  [ErrorCodeEnum.EmailNotVerified]: "E-mail non vérifié",
  [ErrorCodeEnum.RefreshTokenInvalid]: "Jeton d'actualisation invalide",
  [ErrorCodeEnum.OtpInvalid]: "Code de vérification invalide",
  [ErrorCodeEnum.OtpExpired]: "Code de vérification expiré. Veuillez en demander un nouveau",
  [ErrorCodeEnum.EmailNotFound]: "E-mail introuvable",
  [ErrorCodeEnum.EmailAlreadyExists]: "Cet e-mail est déjà enregistré",
  [ErrorCodeEnum.EmailAlreadyVerified]: "Cet e-mail est déjà vérifié",
  [ErrorCodeEnum.UsernameAlreadyExists]: "Ce nom d'utilisateur est déjà utilisé",
  [ErrorCodeEnum.RateLimited]: "Trop de tentatives. Veuillez patienter un instant",
  [ErrorCodeEnum.UserNotFound]: "Utilisateur introuvable",
  [ErrorCodeEnum.RequestAlreadyExists]: "Demande d'ami déjà envoyée",
  [ErrorCodeEnum.AlreadyFriends]: "Vous êtes déjà amis",
  [ErrorCodeEnum.ReceiverHasAlreadySentRequest]: "Cet utilisateur vous a déjà envoyé une demande",
  [ErrorCodeEnum.FriendRequestNotFound]: "Demande d'ami introuvable",
  [ErrorCodeEnum.IsNotFriend]: "Vous n'êtes pas ami avec cet utilisateur",
  [ErrorCodeEnum.AlreadyBlocked]: "Utilisateur déjà bloqué",
  [ErrorCodeEnum.NotBlocked]: "Cet utilisateur n'est pas bloqué",
  [ErrorCodeEnum.CannotSelfBlock]: "Vous ne pouvez pas vous bloquer vous-même",
  [ErrorCodeEnum.UserBlockedYou]: "Cet utilisateur vous a bloqué",
  [ErrorCodeEnum.YouBlockedUser]: "Vous avez bloqué cet utilisateur",
  [ErrorCodeEnum.RequestAlreadyProcessed]: "Demande d'ami déjà traitée",
  [ErrorCodeEnum.RoomNotFound]: "Salle de jeu introuvable",
  [ErrorCodeEnum.PlayerNotFound]: "Joueur introuvable",
  [ErrorCodeEnum.InvalidGameType]: "Type de jeu invalide",
  [ErrorCodeEnum.InvalidRoomId]: "Identifiant de salle invalide",
  [ErrorCodeEnum.InvalidRequest]: "Requête invalide",
  [ErrorCodeEnum.ValidationError]: "Erreur de validation",
  [ErrorCodeEnum.ServerError]: "Erreur du serveur. Veuillez réessayer",
};

export { fr };