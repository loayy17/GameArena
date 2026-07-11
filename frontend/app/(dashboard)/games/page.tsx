"use client";

import { Gamepad2, ArrowRightFromLine } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";

import { GIconTile } from "@/component/common/GIconTile";
import { GameCard } from "@/component/games/common/GameCard";
import { GButton } from "@/component/common/GButton";
import { GModal } from "@/component/common/GModal";
import { GamesList } from "@/domain/constant/games";
import { useGame } from "@/app/providers/GameProvider";

function GamesPage() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TGamesTranslation;
  const { state, leaveGame } = useGame();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const isInGame = state !== null;

  const handleGameSelect = (path: string) => {
    if (isInGame) {
      setPendingPath(path);
      return;
    }
    router.push(`/games/${path}`);
  };

  const handleConfirmLeave = async () => {
    await leaveGame();
    if (pendingPath) router.push(`/games/${pendingPath}`);
    setPendingPath(null);
  };

  const handleCancelLeave = () => setPendingPath(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="mb-8">
        <div className="mb-6 flex justify-center">
          <GIconTile gradient="bg-primary-muted" size="lg" icon={Gamepad2} className="text-text" />
        </div>

        <h1 className="mb-2 text-4xl font-black tracking-tight text-text">{t.title}</h1>

        <p className="text-sm text-text-secondary">{t.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {GamesList.map((game) => (
          <GameCard
            key={game.type}
            name={t[game.name]}
            desc={t[game.description]}
            onClick={() => handleGameSelect(game.path)}
            gradient={game.gradient}
            playLabel={t.play}
          />
        ))}
      </div>

      <GModal open={pendingPath !== null} onClose={handleCancelLeave} role="alertdialog" ariaLabel="Leave game confirmation">
        <div className="text-center">
          <GIcon icon={ArrowRightFromLine} size="3xl" color="warning" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">Leave current game?</h2>
          <p className="text-sm text-text-secondary mb-6">You have an active game. Leave it to start a new one?</p>
          <div className="flex gap-3">
            <GButton onClick={handleCancelLeave} variant="secondary" fullWidth>
              Cancel
            </GButton>
            <GButton onClick={handleConfirmLeave} variant="danger" fullWidth>
              Leave & Start New
            </GButton>
          </div>
        </div>
      </GModal>
    </div>
  );
}
export default GamesPage;
