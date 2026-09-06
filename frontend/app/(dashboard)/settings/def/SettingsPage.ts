import type { useAuth } from "@/app/providers/AuthProvider";

export interface ISettingsContentProps {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}
