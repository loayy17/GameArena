"use client";
import { Users } from "lucide-react";

export default function Friends() {
    return (
        <div className="flex items-center justify-center h-full relative z-10">
            <div className="text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_-5px_#00d2ff]">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-neon-blue via-primary to-neon-purple bg-clip-text text-transparent">Friends</span>
                </h1>
                <p className="text-text-secondary/60 text-sm mt-3">Coming soon</p>
            </div>
        </div>
    );
}
