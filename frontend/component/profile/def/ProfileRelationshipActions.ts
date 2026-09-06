import type { TNullable } from "@/domain/type/TCommon";
import type { TUserProfileTranslation } from "@/app/(dashboard)/profile/i18n/en.i18n";

type ProfileRelationship = "self" | "none" | "sent" | "received" | "friend" | "blocked";

interface IProfileRelationshipActionsProps {
  profileId: string;
  userId: TNullable<string>;
  t: TUserProfileTranslation;
}

export type { ProfileRelationship, IProfileRelationshipActionsProps };
