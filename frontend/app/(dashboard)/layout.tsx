import { Sidebar } from "@/component/side_bar";
import { SocialPanel } from "@/component/social_media";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen bg-bg-dark text-text overflow-hidden font-sans antialiased">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
                {/* Shared background layers */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#7c5cfc12,_transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#00d2ff08,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#e040fb08,_transparent_50%)]" />
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px] animate-glow" />
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(124,92,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.3) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                {children}
            </main>
            <SocialPanel />
        </div>
    );
}
