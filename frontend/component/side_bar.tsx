"use client";
import {
    Home,
    Users,
    MessageSquare,
    Gamepad2,
    History,
    UserCircle,
    Settings,
    LogOut,
    Hexagon,
    CircleX,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const currentUser = {
    name: "Loay",
    level: 42,
    avatar: "https://i.pravatar.cc/150?img=3",
};

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "friends", label: "Friends", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "history", label: "Match History", icon: History },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
];

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const pathname = usePathname();

    return (
        <aside
            className={`shrink-0 bg-gradient-to-b from-bg-sidebar via-bg-sidebar to-bg-dark border-r border-border-light flex flex-col h-full transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center justify-between p-5 h-20 border-b border-border">
                {!isCollapsed && (
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-2 animate-fade-in">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
                                <Hexagon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold tracking-wider text-white uppercase text-lg">
                                Game<span className="text-neon-blue">Arena</span>
                            </span>
                        </div>
                        <CircleX
                            size={24}
                            onClick={() => setIsCollapsed(true)}
                            className="text-text-secondary hover:bg-surface-alt hover:text-text cursor-pointer rounded-lg p-1 transition-colors"
                        />
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center mx-auto cursor-pointer" onClick={() => setIsCollapsed(false)}>
                        <Hexagon className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                {!isCollapsed && (
                    <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase px-3 mb-3">
                        Main Menu
                    </span>
                )}

                {navItems.map(({ id, label, icon: Icon, badge }) => {
                    const isActive = pathname === `/${id}`;
                    return (
                        <Link
                            href={`/${id}`}
                            key={id}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 group
                                ${isActive
                                    ? "bg-gradient-to-r from-primary/20 to-neon-purple/10 text-white border border-primary/30"
                                    : "text-text-secondary hover:bg-surface-alt hover:text-text border border-transparent"
                                }
                                ${isCollapsed && "justify-center"}`}
                        >
                            <div className={`shrink-0 ${isActive ? "text-neon-blue" : "text-text-secondary group-hover:text-text"}`}>
                                <Icon size={20} />
                            </div>

                            {!isCollapsed && (
                                <span className="text-sm truncate">{label}</span>
                            )}

                            {badge && !isCollapsed && (
                                <span className="ml-auto bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold px-2 py-0.5 rounded-lg min-w-5 text-center">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border bg-bg-sidebar/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-alt/60 transition-all group cursor-pointer">
                    <div className="relative shrink-0">
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-border-light group-hover:border-neon-blue transition-colors"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neon-green border-2 border-bg-sidebar" />
                    </div>

                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-text truncate">
                                    {currentUser.name}
                                </h4>
                                <p className="text-xs text-neon-blue font-medium">
                                    LVL {currentUser.level}
                                </p>
                            </div>
                            <button className="p-1.5 text-text-secondary hover:text-error rounded-lg hover:bg-error/10 transition-colors">
                                <LogOut size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}

export { Sidebar };
