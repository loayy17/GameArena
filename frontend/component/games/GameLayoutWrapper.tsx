"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { useGame } from "@/app/providers/GameProvider";
import { GAsync } from "@/component/common/GAsync";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GameActive } from "./GameActive";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";

import type { IGameState } from "@/app/providers/def/IGameState";
import type { TNullable } from "@/domain/type/TCommon";
import type { GameStageKind } from "@/domain/enum/GameStageEnum";
import type { IGameLayoutWrapperProps } from "./def/GameLayoutWrapper";

function resolveStage(state: TNullable<IGameState>, connected: boolean, searching: boolean): GameStageKind {
  if (!state) return connected && !searching ? "entry" : "loading";
  if (!state.player2Id) return "lobby";
  if (!state.hasStarted) return "ready";
  return "active";
}

function GameLayoutWrapper({ children, gameType }: IGameLayoutWrapperProps) {
  const { state, isConnected, isSearching } = useGame();
  const t = useGameTranslation();
  const router = useRouter();

  // Never render a room belonging to a different game on this page.
  const pageState = state && state.gameType === gameType ? state : null;

  if (!isConnected && !isSearching && !pageState) {
    return (
      <div className="flex items-center justify-center p-8">
        <GCard className="w-full max-w-md text-center p-6">
          <GEmpty
            icon={<GIcon icon={AlertTriangle} size={SizeEnum.xl} color={AccentColorEnum.Warning} />}
            title={t.game.disconnectedTitle}
            description={t.game.disconnectedDesc}
          />
          <GButton variant={ButtonVariantEnum.Primary} className="mt-4" onClick={() => router.push("/games")}>
            {t.game.backToGames}
          </GButton>
        </GCard>
      </div>
    );
  }

  const stage = resolveStage(pageState, isConnected, isSearching);

  if (stage === "loading") {
    return <GAsync loading spinnerSize={SizeEnum.lg} spinnerLabel={isSearching ? t.lobby.searchingTitle : undefined} className="p-4" />;
  }
  if (stage === "entry") return <GameEntry gameType={gameType} />;
  if (stage === "lobby") return <GameLobby gameType={gameType} />;
  if (stage === "ready") return <GameReady gameType={gameType} />;
  return <GameActive gameType={gameType}>{children}</GameActive>;
}

export { GameLayoutWrapper };
