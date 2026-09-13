import type { UseAsideReturn } from "@/hooks/useAside";
import type { TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import type { INavSection } from "@/component/common/def/GNav";

interface ISidebarProps {
  aside?: UseAsideReturn;
}

interface ISidebarFooterProps {
  collapsed: boolean;
  closeMobile: () => void;
  t: TSidebarTranslation;
}

interface ISidebarNavSectionsProps {
  sections: INavSection[];
  collapsed?: boolean;
}

export type { ISidebarProps, ISidebarFooterProps, ISidebarNavSectionsProps };
