import { CardVariantEnum } from "../enum/CardVariantEnum";

const cardVariantStyles: Record<CardVariantEnum, string> = {
  [CardVariantEnum.Default]: "bg-bg-card border border-border/40",
  [CardVariantEnum.Outlined]: "bg-transparent border border-border/30",
  [CardVariantEnum.Elevated]: "bg-bg-elevated border border-border/30 shadow-sm",
  [CardVariantEnum.Interactive]: "bg-bg-card border border-border/40 cursor-pointer transition-colors hover:bg-bg-card-hover hover:border-border/60",
};

export { cardVariantStyles };
