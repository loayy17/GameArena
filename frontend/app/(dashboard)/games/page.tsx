"use client";

import { Gamepad2, ArrowRightFromLine } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";

import { GPage } from "@/component/common/GPage";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GCard } from "@/component/common/GCard";
import { GBadge } from "@/component/common/GBadge";
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
    <GPage width="lg">
      <GCard padding="md">
        <GPageHeader
          badge={
            <GBadge>
              <GIcon icon={Gamepad2} size="xs" color="primary" />
              {t.badge}
            </GBadge>
          }
          title={t.title}
          subtitle={t.subtitle}
        />
      </GCard>

      <GCard padding="sm" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {GamesList.map((game) => (
            <GameCard
              key={game.type}
              name={t[game.name]}
              desc={t[game.description]}
              onClick={() => handleGameSelect(game.path)}
              gradient={game.gradient}
              animation={game.animation}
              playLabel={t.play}
            />
          ))}
        </div>
      </GCard>

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
    </GPage>
  );
}
export default GamesPage;
