"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import type { IGameState } from "@/app/providers/def/IGameState";
import { GAsync } from "@/component/common/GAsync";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AlertTriangle } from "lucide-react";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { TNullable } from "@/domain/type/TCommon";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GameActive } from "./GameActive";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import type { IGameLayoutWrapperProps } from "./def/GameLayoutWrapper";

type GameStageKind = "loading" | "entry" | "lobby" | "ready" | "active";

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

  if (!isConnected && !isSearching && !state) {
    return (
      <div className="flex items-center justify-center p-8">
        <GCard padding={SizeEnum.lg} className="w-full max-w-md text-center">
          <GEmpty
            icon={<GIcon icon={AlertTriangle} size={SizeEnum.xl} color={AccentColorEnum.Warning} />}
            title="Disconnected"
            description="Connection lost. Please try again."
          />
          <GButton variant={ButtonVariantEnum.Primary} className="mt-4" onClick={() => router.push("/games")}>
            {t.game.backToGames}
          </GButton>
        </GCard>
      </div>
    );
  }

  const stage = resolveStage(state, isConnected, isSearching);

  if (stage === "loading") {
    return <GAsync loading spinnerSize={SizeEnum.lg} spinnerLabel={isSearching ? t.lobby.searchingTitle : undefined} className="p-4" />;
  }
  if (stage === "entry") return <GameEntry gameType={gameType} />;
  if (stage === "lobby") return <GameLobby gameType={gameType} />;
  if (stage === "ready") return <GameReady gameType={gameType} />;
  return <GameActive gameType={gameType}>{children}</GameActive>;
}

export { GameLayoutWrapper };
