import { Bell, Gamepad2, History, Home, MessageSquare, Settings, ShieldCheck, Trophy, Users } from "lucide-react";

const navGroupOrder = ["main", "social", "competition", "account", "administration"];
const sidebarNav = [
  { id: "home", labelKey: "home", icon: Home, group: "main" },
  { id: "games", labelKey: "games", icon: Gamepad2, group: "main" },
  {
    id: "messages",
    labelKey: "messages",
    icon: MessageSquare,
    badge: "messages",
    group: "social",
  },
  { id: "friends", labelKey: "friends", icon: Users, badge: "friends", group: "social" },
  { id: "notifications", labelKey: "notifications", icon: Bell, badge: "invites", group: "social" },
  { id: "leaderboard", labelKey: "leaderboard", icon: Trophy, group: "competition" },
  { id: "history", labelKey: "history", icon: History, group: "competition" },
  { id: "settings", labelKey: "settings", icon: Settings, group: "account" },
  { id: "admin", labelKey: "admin", icon: ShieldCheck, group: "administration" },
];

export type TNavGroup = (typeof navGroupOrder)[number];
export { sidebarNav, navGroupOrder };
