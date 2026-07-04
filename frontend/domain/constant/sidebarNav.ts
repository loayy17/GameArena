import {
  Gamepad2,
  Home,
  MessageSquare,
  Settings,
  UserCircle,
  Users,
  History,
} from "lucide-react";

const sidebarNav = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "friends", labelKey: "friends", icon: Users, badge: "friends" },
  {
    id: "messages",
    labelKey: "messages",
    icon: MessageSquare,
    badge: "messages",
  },
  { id: "games", labelKey: "games", icon: Gamepad2 },
  { id: "history", labelKey: "history", icon: History },
  { id: "profile", labelKey: "profile", icon: UserCircle },
  { id: "settings", labelKey: "settings", icon: Settings },
];

export { sidebarNav };
