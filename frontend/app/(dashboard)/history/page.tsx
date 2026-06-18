"use client";
import { History } from "lucide-react";

export default function MatchHistory() {
    return (
        <div className="flex items-center justify-center h-full relative z-10">
            <div className="text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_-5px_#f59e0b]">
                    <History className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-neon-blue via-primary to-neon-purple bg-clip-text text-transparent">Match History</span>
                </h1>
                <p className="text-text-secondary/60 text-sm mt-3">Coming soon</p>
            </div>
        </div>
    );
}
