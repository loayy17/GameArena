"use client";

import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { useState } from "react";

const friends = [
    { name: "Ahmed", status: "Playing Match", rank: 1 },
    { name: "Sara", status: "In Lobby", rank: 2 },
    { name: "Omar", status: "Playing Match", rank: 3 },
    { name: "Lina", status: "Online", rank: 4 },
    { name: "Yousef", status: "Playing Match", rank: 5 },
    { name: "Mona", status: "In Match", rank: 6 },
    { name: "Khaled", status: "Playing Match", rank: 7 },
    { name: "Nora", status: "Online", rank: 8 },
    { name: "Tarek", status: "Playing Match", rank: 9 },
    { name: "Hana", status: "In Lobby", rank: 10 },
    { name: "Ali", status: "Playing Match", rank: 11 },
    { name: "Fatima", status: "Online", rank: 12 },
];

function SocialPanel() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`
                hidden lg:flex lg:flex-col shrink-0 bg-gradient-to-b from-bg-sidebar via-bg-sidebar to-bg-dark border-l border-border overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out
                ${isCollapsed ? "w-16" : "w-80"}
            `}
        >
            {/* Toggle Button */}
            <div className={`flex w-full p-4 ${isCollapsed ? "justify-center" : "justify-end"}`}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-text-secondary hover:bg-surface-alt hover:text-text p-2 rounded-xl border border-border transition-colors cursor-pointer"
                    title={isCollapsed ? "Expand panel" : "Collapse panel"}
                >
                    {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>

            {/* Header */}
            <div className={`px-4 mb-4 ${isCollapsed ? "hidden" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                        Friends Activity
                    </h2>
                </div>
                <p className="text-[11px] text-text-secondary/60">
                    {friends.filter(f => f.status === "Playing Match").length} in match
                </p>
            </div>

            {/* Friends List */}
            <div className="space-y-2 px-3 w-full">
                {friends.map((friend) => (
                    <div
                        key={friend.rank}
                        className={`
                            flex items-center gap-3 p-2.5 rounded-xl bg-surface-alt/30 border border-border hover:border-primary/30 hover:bg-surface-alt/60 transition-all duration-200 cursor-pointer group
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                    >
                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-neon-purple shrink-0 flex items-center justify-center relative">
                            <span className="text-[10px] text-white font-bold select-none">
                                {friend.rank}
                            </span>
                            {/* Online indicator */}
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-bg-sidebar" />
                        </div>

                        {/* Friend Info */}
                        <div
                            className={`
                                flex-1 min-w-0 transition-all duration-200 origin-left
                                ${isCollapsed ? "opacity-0 scale-95 w-0 pointer-events-none hidden" : "opacity-100 scale-100"}
                            `}
                        >
                            <p className="text-sm font-medium text-text truncate group-hover:text-white transition-colors">
                                {friend.name}
                            </p>
                            <p className={`text-xs truncate ${
                                friend.status === "Playing Match" 
                                    ? "text-neon-blue" 
                                    : friend.status === "In Lobby"
                                    ? "text-neon-purple"
                                    : "text-neon-green"
                            }`}>
                                {friend.status === "Playing Match" && <Gamepad2 className="inline w-3 h-3 mr-1" />}
                                {friend.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export { SocialPanel };
