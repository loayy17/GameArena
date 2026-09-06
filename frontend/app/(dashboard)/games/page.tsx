"use client";

import { Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { GameCard } from "@/component/games/common/GameCard";
import { LeaveGameModal } from "@/component/games/common/LeaveGameModal";
import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { useGame } from "@/app/providers/GameProvider";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GPage } from "@/component/common/GPage";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { TGamesTranslation } from "./i18n/en.i18n";
import type { TNullable } from "@/domain/type/TCommon";

function GamesPage() {
  const router = useRouter();
  const { state, leaveGame } = useGame();
  const t = useTranslation<TGamesTranslation>({ en, ar, fr });
  const gt = useGameTranslation();
  const [pendingPath, setPendingPath] = useState<TNullable<string>>(null);

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
    <GPage size={SizeEnum.lg}>
      <GPageHeader
        icon={Gamepad2}
        title={t.games}
        subtitle={t.chooseGame}
        className="hidden md:block"
        badge={
          <GBadge>
            <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.play}
          </GBadge>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GamesList.map((game) => {
          const { name, description } = translateGameInfo(gt, game.type);
          return (
            <GameCard
              key={game.id}
              name={name}
              desc={description}
              animation={game.animation}
              playLabel={t.play}
              onPlay={() => handleGameSelect(game.path)}
            />
          );
        })}
      </div>
      <LeaveGameModal
        open={Boolean(state) && pendingPath !== null}
        title={t.leaveTitle}
        description={t.leaveDesc}
        cancelLabel={t.cancel}
        confirmLabel={t.leaveConfirm}
        onCancel={() => setPendingPath(null)}
        onConfirm={handleConfirmLeave}
      />
    </GPage>
  );
}

export default GamesPage;
