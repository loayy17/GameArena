"use client";

import { Gamepad2, ArrowRightFromLine } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";
import { GameRow } from "@/component/games/common/GameRow";
import { GButton } from "@/component/common/GButton";
import { GModal } from "@/component/common/GModal";
import { GamesList } from "@/domain/constant/games";
import { useGame } from "@/app/providers/GameProvider";
import { GBadge } from "@/component/common/GBadge";
import { PageHeader } from "@/component/common/PageHeader";
import { GPage } from "@/component/common/GPage";
import type { TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

function GamesPage() {
  const router = useRouter();
  const { state, leaveGame } = useGame();
  const t = useTranslation({ en, ar, fr }) as TGamesTranslation;
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
      <PageHeader
        icon={Gamepad2}
        title={t.games}
        subtitle={t.chooseGame}
        badge={
          <GBadge>
            <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.play}
          </GBadge>
        }
      />
      <GList items={[...GamesList]} keyExtractor={(game) => game.id} emptyMessage="" emptyDescription="" listClassName="grid-cols-1 gap-3">
        {(game) => <GameRow game={game} gt={gt} onClick={() => handleGameSelect(game.path)} playLabel={t.play} />}
      </GList>
      <GModal open={Boolean(state) && pendingPath !== null} onClose={() => setPendingPath(null)} role="alertdialog" ariaLabel={t.leaveConfirmation}>
        <div className="text-center">
          <GIcon icon={ArrowRightFromLine} size={SizeEnum.lg} color={AccentColorEnum.Warning} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">{t.leaveTitle}</h2>
          <p className="text-sm text-text-secondary mb-6">{t.leaveDesc}</p>
          <div className="flex gap-3">
            <GButton variant={ButtonVariantEnum.Secondary} fullWidth onClick={() => setPendingPath(null)}>
              {t.cancel}
            </GButton>
            <GButton variant={ButtonVariantEnum.Danger} fullWidth onClick={handleConfirmLeave}>
              {t.leaveConfirm}
            </GButton>
          </div>
        </div>
      </GModal>
    </GPage>
  );
}

export default GamesPage;
