"use client";

import { Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GamesList } from "@/domain/constant/games";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";

function ActiveGameBanner() {
  const { state, lastGameType } = useGame();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = state?.hasStarted === true && state?.isFinished === false;
  const isOnGamePage = pathname.startsWith("/games/") && pathname !== "/games";

  if (!isActive || isOnGamePage) return null;

  const gamePath =
    lastGameType !== null
      ? GamesList.find((g) => g.type === (lastGameType as typeof g.type))?.path ?? "tic-tac-toe"
      : "tic-tac-toe";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <GButton
        onClick={() => router.push(`/games/${gamePath}`)}
        size="lg"
        className="shadow-xl rounded-full px-5 gap-3"
        leftIcon={<GIcon icon={Gamepad2} size="md" color="inherit" className="animate-pulse" />}>
        Return to Game
      </GButton>
    </div>
  );
}

export { ActiveGameBanner };
