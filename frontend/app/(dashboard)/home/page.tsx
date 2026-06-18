"use client";
import { Gamepad2, ArrowRight, Swords, Puzzle, Orbit, Zap, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

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

function FloatingParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        let w = c.width = c.offsetWidth;
        let h = c.height = c.offsetHeight;
        const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 2 + 0.5, a: Math.random() * 0.4 + 0.1,
            });
        }
        let anim: number;
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 92, 252, ${p.a})`;
                ctx.fill();
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(124, 92, 252, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            anim = requestAnimationFrame(draw);
        }
        draw();
        const onResize = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
        window.addEventListener("resize", onResize);
        return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", onResize); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function Home() {
    return (
        <>
            <FloatingParticles />
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
                        <p className="text-text-secondary/80 text-lg max-w-lg mx-auto">Enter the arena. Pick your battle.</p>
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
                                                PLAY NOW
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
        </>
    );
}
