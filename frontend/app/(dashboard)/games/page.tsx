"use client";

import { Gamepad2, ArrowRightFromLine } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";

import { GameCard } from "@/component/games/common/GameCard";
import { GButton } from "@/component/common/GButton";
import { GModal } from "@/component/common/GModal";
import { GamesList, GamesMap } from "@/domain/constant/games";
import { useGame } from "@/app/providers/GameProvider";
import { GBadge } from "@/component/common/GBadge";
import { PageHeader } from "@/component/common/PageHeader";
import { GPage } from "@/component/common/GPage";

function GamesPage() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TGamesTranslation & Record<string, string>;
  const { state, leaveGame } = useGame();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleGameSelect = (path: string) => {
    if (state) {
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

  return (
    <GPage width="lg">
      <PageHeader
        icon={Gamepad2}
        title={t.games}
        subtitle={t.chooseGame}
        badge={
          <GBadge>
            <GIcon icon={Gamepad2} size="xs" color="primary" />
            {t.play}
          </GBadge>
        }
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {GamesList.map((game) => {
          const gameConfig = GamesMap[game.id];
          return (
            <GameCard
              key={game.id}
              name={t[gameConfig.name]}
              desc={t[gameConfig.description]}
              onClick={() => handleGameSelect(gameConfig.path)}
              gradientClass={gameConfig.gradientClass}
              animation={gameConfig.animation}
              playLabel={t.play}
              page
            />
          );
        })}
      </div>
      <GModal
        open={Boolean(state) && pendingPath !== null}
        onClose={() => setPendingPath(null)}
        role="alertdialog"
        ariaLabel="Leave game confirmation">
        <div className="text-center">
          <GIcon icon={ArrowRightFromLine} size="3xl" color="warning" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">{t.leaveTitle}</h2>
          <p className="text-sm text-text-secondary mb-6">{t.leaveDesc}</p>
          <div className="flex gap-3">
            <GButton onClick={() => setPendingPath(null)} variant="secondary" fullWidth>
              {t.cancel}
            </GButton>
            <GButton onClick={handleConfirmLeave} variant="danger" fullWidth>
              {t.leaveConfirm}
            </GButton>
          </div>
        </div>
      </GModal>
    </GPage>
  );
}

export default GamesPage;
