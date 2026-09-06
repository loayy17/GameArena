"use client";

import { useMemo } from "react";
import { Bell, Users } from "lucide-react";

import { GTabs } from "@/component/common/GTabs";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { SocialTabIdEnum as SocialTabId } from "@/domain/enum/SocialTabIdEnum";

import type { IGTabItem } from "@/component/common/def/GTabs";
import type { ISocialTabsProps } from "./def/SocialTabs";

function SocialTabs({ value, onChange, labels, badges }: ISocialTabsProps) {
  const tabs = useMemo<IGTabItem<SocialTabId>[]>(
    () => [
      {
        id: SocialTabId.Friends,
        label: labels.friends,
        icon: <GIcon icon={Users} size={SizeEnum.sm} />,
        badge: badges?.friends,
      },
      {
        id: SocialTabId.Notifications,
        label: labels.notifications,
        icon: <GIcon icon={Bell} size={SizeEnum.sm} />,
        badge: badges?.notifications,
      },
    ],
    [labels, badges],
  );

  return <GTabs tabs={tabs} value={value} onChange={(id) => onChange(id as SocialTabId)} tabClassName="w-full md:flex-1 md:justify-center" />;
}

export { SocialTabs, SocialTabId };
