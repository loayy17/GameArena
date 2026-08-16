"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GUserInfo } from "@/component/common/GUserInfo";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { fr } from "@/component/i18n/SideBar/fr.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import type { ISidebarFooterProps } from "./def/SidebarFooter";

function SidebarFooter({ collapsed, closeMobile }: ISidebarFooterProps) {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslation({ en, ar, fr }) as TSidebarTranslation;

  return (
    <div className={clsx("flex flex-col gap-1.5 p-2 pb-safe", collapsed && "items-center")}>
      <LangTheme collapsed={collapsed} align="top" />

      {collapsed ? (
        <>
          {user && (
            <GButton
              variant={ButtonVariantEnum.Subtle}
              size={SizeEnum.icon}
              aria-label={t.settings}
              title={t.settings}
              onClick={() => {
                router.push("/settings");
                closeMobile();
              }}>
              <GAvatar firstName={user.firstName} lastName={user.lastName} avatarUrl={user.avatarUrl} status={user.status} size={SizeEnum.xs} />
            </GButton>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3 p-2">
          {user && (
            <GUserInfo
              firstName={user.firstName}
              lastName={user.lastName}
              userName={user.userName}
              avatarUrl={user.avatarUrl}
              status={user.status}
              avatarSize={SizeEnum.xs}
              className="flex-1"
            />
          )}
          <GButton
            variant={ButtonVariantEnum.Subtle}
            size={SizeEnum.icon}
            rounded={SizeEnum.xl}
            title={t.settings}
            aria-label={t.settings}
            onClick={() => {
              router.push("/settings");
              closeMobile();
            }}>
            <GIcon icon={Settings} size={SizeEnum.md} />
          </GButton>
        </div>
      )}
    </div>
  );
}

export { SidebarFooter };
