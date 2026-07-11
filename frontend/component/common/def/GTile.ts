import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface GTileProps {
  user: IUserSummary;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export type { GTileProps };
