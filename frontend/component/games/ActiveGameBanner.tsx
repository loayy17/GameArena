"use client";

import { ArrowRight, Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GAMES_BY_TYPE, GamesList, translateGameInfo } from "@/domain/constant/games";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "../common/GCard";
import { en, type TGamesTranslation } from "@/app/(dashboard)/games/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/games/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/games/i18n/fr.i18n";
import { en as GEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as GAr } from "@/component/i18n/Game/ar.i18n";
import { fr as GFr } from "@/component/i18n/Game/fr.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

function ActiveGameBanner() {
  const { state } = useGame();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation({ en, ar, fr }) as TGamesTranslation & { returnToGame: string; gameRunning: string };
  const gT = useTranslation<GameTranslations>({ en: GEn, ar: GAr, fr: GFr });
  const isOnGamePage = pathname.startsWith("/games/") && pathname !== "/games";

  if (!state || state.isFinished || isOnGamePage) return null;

  const cfg = GAMES_BY_TYPE[state.gameType as GamesKindEnum] ?? GamesList[0];
  const gamePath = cfg.path;
  const gameName = translateGameInfo(gT, cfg.type).name;

  return (
    <div className="fixed banner-position inset-inline-4 sm:inset-inline-end-4 sm:w-96 sm:max-w-none z-fixed">
      <GCard
        variant={CardVariantEnum.Elevated}
        padding={SizeEnum.md}
        className="flex items-center gap-4 pb-safe shadow-xl shadow-black/15 border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-[inherit]" />
        <div className="relative flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/15">
          <GIcon icon={cfg.icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider">{t.gameRunning}</div>
          <div className="text-base font-bold text-text truncate">{gameName}</div>
        </div>
        <GButton
          variant={ButtonVariantEnum.Primary}
          size={SizeEnum.sm}
          className="relative whitespace-nowrap"
          onClick={() => router.push(`/games/${gamePath}`)}>
          <GIcon icon={Gamepad2} size={SizeEnum.sm} />
          <span>{t.returnToGame}</span>
          <GIcon icon={ArrowRight} size={SizeEnum.sm} flip />
        </GButton>
      </GCard>
    </div>
  );
}

export { ActiveGameBanner };
