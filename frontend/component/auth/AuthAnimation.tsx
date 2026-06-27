import dynamic from "next/dynamic";
import { useTranslation } from "@/Hooks/useTranslation";
import { en, TAuthAnimation } from "../i18n/AuthAnimation/en.i18n";
import { ar } from "../i18n/AuthAnimation/ar.i18n";
import type { TAnimationProps } from "./def/TAnimation";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

function AuthAnimation({ page, className, pathAnimation }: TAnimationProps) {
  const t = useTranslation({ en, ar }) as TAuthAnimation;

  return (
    <div
      className={`w-full lg:w-1/2 relative overflow-hidden flex flex-col items-center justify-start pt-14 pb-8 lg:justify-center lg:py-0 px-6 rounded-b-2xl lg:rounded-2xl m-0 lg:m-6 ${className || ""}`}
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <div className="w-48 h-48 lg:w-64 lg:h-64">
          <LottiePlayer
            autoplay
            loop
            src={pathAnimation || "/game.json"}
            className="w-full h-full"
          />
        </div>
        <div className="text-center mt-4 lg:mt-8">
          <h2 className="text-white text-2xl lg:text-3xl font-bold mb-2">
            {t.authTitle[page]}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)" }} className="text-sm">
            {t.authSubtitle[page]}
          </p>
        </div>
      </div>
    </div>
  );
}

export { AuthAnimation };
