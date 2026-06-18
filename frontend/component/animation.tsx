import dynamic from "next/dynamic";
import { TAnimationProps } from "./def/T_animation";

const LottiePlayer = dynamic(
    () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
    { ssr: false },
);

function CustomAnimation({ title, className, pathAnimation }: TAnimationProps) {
    return (
        <div className={`hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center m-6 rounded-2xl ${className || ''}`}
            style={{ background: "linear-gradient(145deg, #2a1a6e 0%, #0f0530 55%, #1a0840 100%)" }}
        >
            {/* Ambient glow orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(124,92,252,0.25) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(224,64,251,0.15) 0%, transparent 70%)" }} />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col items-center w-full px-16">
                <div className="w-full max-w-sm">
                    <LottiePlayer
                        autoplay
                        loop
                        src={pathAnimation || "/game.json"}
                        className="w-full"
                    />
                </div>
                <div className="text-center mt-8">
                    <h2 className="text-white text-3xl font-bold mb-2">
                        {title || "Join Us Today"}
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.45)" }} className="text-sm">
                        Create your account and get started
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CustomAnimation;