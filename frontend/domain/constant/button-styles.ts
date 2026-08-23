import { ButtonVariantEnum } from "../enum/ButtonVariantEnum";

const buttonVariantStyles: Record<ButtonVariantEnum, string> = {
  [ButtonVariantEnum.Primary]: "bg-primary text-on-primary hover:bg-primary-hover shadow-sm hover:shadow",
  [ButtonVariantEnum.Secondary]: "bg-surface text-text border border-border/40 hover:bg-surface-hover hover:border-border/60",
  [ButtonVariantEnum.Subtle]: "bg-transparent text-text-secondary hover:bg-surface hover:text-text",
  [ButtonVariantEnum.Danger]: "bg-danger text-on-primary hover:bg-danger/90 shadow-sm",
};

export { buttonVariantStyles };
