import { Bell, Gamepad2, History, Home, MessageSquare, Settings, Users } from "lucide-react";

const sidebarNav = [
  { id: "home", labelKey: "home", icon: Home, mobile: true },
  { id: "friends", labelKey: "friends", icon: Users, badge: "friends", mobile: true },
  {
    id: "messages",
    labelKey: "messages",
    icon: MessageSquare,
    badge: "messages",
    mobile: true,
  },
  { id: "games", labelKey: "games", icon: Gamepad2, mobile: true },
  { id: "history", labelKey: "history", icon: History, mobile: true },
  { id: "notifications", labelKey: "notifications", icon: Bell, badge: "invites", mobile: false },
  { id: "settings", labelKey: "settings", icon: Settings, mobile: false },
];

export { sidebarNav };
