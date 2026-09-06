import Link from "next/link";
import { cn } from "@/lib/cn";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { focusRing } from "@/domain/constant/style-tokens";
import { withFullName } from "@/domain/lib/userUtils";
import { GAvatar } from "@/component/common/GAvatar";
import type { IGUserRowProps } from "./def/GUserRow";

function highlight(text: string, query?: string) {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return text;
  }

  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  return text.split(regex).map((part, index) => {
    const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase();

    return isMatch ? (
      <mark key={index} className="rounded bg-primary-muted px-0.5 text-primary">
        {part}
      </mark>
    ) : (
      part
    );
  });
}

function GUserRow({
  user,
  size = SizeEnum.sm,
  query,
  unreadCount,
  userNameFallback,
  active = false,
  href,
  onClick,
  trailing,
  className,
}: IGUserRowProps) {
  const name = withFullName(user).fullName?.trim() || userNameFallback || "";
  const username = user.userName ? `@${user.userName}` : userNameFallback;

  const rowClassName = cn(
    "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-start",
    active ? "bg-primary-muted" : "hover:bg-bg-card-hover",
    focusRing,
  );

  const content = (
    <>
      <GAvatar user={user} size={size} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{highlight(name, query)}</p>

        {username && <p className="truncate text-xs text-text-muted">{username}</p>}
      </div>

      {unreadCount != null && unreadCount > 0 && <GBadge count={unreadCount} className="shrink-0" />}
    </>
  );

  const row = href ? (
    <Link href={href} className={rowClassName} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  ) : onClick ? (
    <GButton
      type="button"
      variant={ButtonVariantEnum.Subtle}
      size={SizeEnum.None}
      onClick={onClick}
      className={cn(rowClassName, "justify-start font-normal")}
      aria-pressed={active || undefined}>
      {content}
    </GButton>
  ) : (
    <div className={cn("flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2", active && "bg-primary-muted")}>{content}</div>
  );

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {row}

      {trailing && <div className="flex shrink-0 items-center gap-1.5">{trailing}</div>}
    </div>
  );
}

export { GUserRow };
