import { Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";

const gameList = [
    { name: "Tic Tac Toe", path: "/tic-tac-toe", desc: "3×3 tactical duel", color: "from-cyan-400 via-neon-blue to-cyan-300" },
    { name: "Snake", path: "/snake", desc: "Classic arcade", color: "from-emerald-400 via-neon-green to-emerald-300" },
    { name: "Pong", path: "/pong", desc: "Retro table tennis", color: "from-violet-400 via-neon-purple to-violet-300" },
];

export default function GamesPage() {
    return (
        <div className="flex items-center justify-center h-full relative z-10 px-8">
            <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-neon-purple to-neon-cyan animate-glow flex items-center justify-center shadow-[0_0_30px_-5px_#7c5cfc]">
                        <Gamepad2 className="w-7 h-7 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2">
                    <span className="bg-gradient-to-r from-neon-blue via-primary to-neon-purple bg-clip-text text-transparent">Games</span>
                </h1>
                <p className="text-text-secondary/60 text-sm mb-8">Choose your game</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {gameList.map((g) => (
                        <Link key={g.name} href={g.path} className="group block bg-bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-white mb-1">{g.name}</h3>
                            <p className="text-xs text-text-secondary/60 mb-4">{g.desc}</p>
                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${g.color} bg-clip-text text-transparent group-hover:underline`}>
                                Play <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}