"use client";
import { useTranslation } from "@/Hooks/useTranslation";
import { Gamepad2, ArrowRight, Swords, Puzzle, Orbit, Zap, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ar from "./i18n/ar.i18n";
import en, { THomeTranslation } from "./i18n/en.i18n";

const games = [
    {
        name: "Snake", path: "/snake", desc: "Classic arcade — eat & survive",
        icon: Orbit, gradient: "from-emerald-400 via-neon-green to-emerald-300",
        borderGlow: "group-hover:shadow-[0_0_40px_-8px_#00e5a0]",
    },
    {
        name: "Tic Tac Toe", path: "/tic-tac-toe", desc: "3×3 tactical duel",
        icon: Puzzle, gradient: "from-cyan-400 via-neon-blue to-cyan-300",
        borderGlow: "group-hover:shadow-[0_0_40px_-8px_#00d2ff]",
    },
    {
        name: "Pong", path: "/pong", desc: "Retro table tennis",
        icon: Swords, gradient: "from-violet-400 via-neon-purple to-violet-300",
        borderGlow: "group-hover:shadow-[0_0_40px_-8px_#e040fb]",
    },
];



export default function Home() {
    const t = useTranslation({ en, ar }) as THomeTranslation;
    return (
        <div className="relative z-10 flex items-center justify-center h-full px-8">
            <div className="w-full max-w-6xl animate-fade-in">
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-glow" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-neon-purple to-neon-cyan animate-glow flex items-center justify-center shadow-[0_0_30px_-5px_#7c5cfc]">
                                <Gamepad2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    </div>
                    <h1 className="text-6xl font-black tracking-tight mb-3">
                        <span className="bg-gradient-to-r from-white via-purple-200 to-zinc-400 bg-clip-text text-transparent">Game</span>
                        <span className="bg-gradient-to-r from-neon-cyan via-primary to-neon-purple bg-clip-text text-transparent">Arena</span>
                    </h1>
                    <p className="text-text-secondary/80 text-lg max-w-lg mx-auto">{t.enterArena}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {games.map((game, i) => {
                        const Icon = game.icon;
                        return (
                            <Link key={game.name} href={game.path} className="group relative" style={{ animationDelay: `${i * 120}ms` }}>
                                <div className={`absolute -inset-[2px] bg-gradient-to-br ${game.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm ${game.borderGlow}`} />
                                <div className="relative h-full bg-bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl p-7 transition-all duration-500 group-hover:border-transparent group-hover:bg-bg-card/70 group-hover:-translate-y-2 overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${game.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-bl-full`} />
                                    <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${game.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-tr-full`} />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-[11px] font-bold text-text-muted tracking-widest">0{i + 1}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{game.name}</h3>
                                        <p className="text-sm text-text-secondary/70 mb-6 leading-relaxed">{game.desc}</p>
                                        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${game.gradient} text-white text-sm font-bold shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105`}>
                                            {t.playNow}
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className="flex items-center justify-center gap-10 mt-14 text-center">
                    <div className="flex items-center gap-2 text-text-secondary/50">
                        <Zap className="w-4 h-4 text-neon-cyan" />
                        <span className="text-xs font-medium">126 online</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary/50">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">3 games</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary/50">
                        <Users className="w-4 h-4 text-neon-green" />
                        <span className="text-xs font-medium">2.4K players</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
