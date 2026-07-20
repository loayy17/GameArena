"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { getGameConfig } from "@/component/games/gameConfig";
import { PlayerCard } from "./PlayerCard";
import { GCard } from "@/component/common/GCard";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface GamePlayersHeaderProps {
  gameType?: GamesKindEnum;
}

function GamePlayersHeader({ gameType }: GamePlayersHeaderProps) {
  const { user } = useAuth();
  const { state, lastGameType } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const effectiveGameType = gameType ?? lastGameType;
  if (!effectiveGameType) return null;

  const { isBotGame: bot, hasStarted, player1Id, player1Username, player2Id, player2Username, currentTurnPlayerId } = state;
  const isBotGame = bot && hasStarted;
  const isLobby = !player2Id;
  const gameInfo = getGameConfig(effectiveGameType);
  const p1IsTurn = currentTurnPlayerId === player1Id && hasStarted && !state.isFinished;
  const p2IsTurn = currentTurnPlayerId === player2Id && hasStarted && !state.isFinished;

  return (
    <GCard padding="sm" className="grid grid-cols-7 items-center">
      <PlayerCard
        playerId={player1Id}
        playerUsername={player1Username}
        symbol={gameInfo.symbol1}
        isBot={isBotGame && player1Id !== user?.id}
        fallbackName={t.game.player1}
        isTurn={p1IsTurn}
        symbolColors={gameInfo.player1Colors}
      />

      <div className="col-span-1 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-text-muted">{t.game.vs}</span>
        <div className="w-px h-10 bg-border/40 mt-1" />
      </div>

      <PlayerCard
        playerId={player2Id}
        playerUsername={player2Username}
        symbol={isLobby ? "?" : gameInfo.symbol2}
        isBot={isBotGame && player2Id !== user?.id}
        fallbackName={isLobby ? t.game.waiting : t.game.player2}
        isTurn={p2IsTurn}
        symbolColors={isLobby ? undefined : gameInfo.player2Colors}
      />
    </GCard>
  );
}

export { GamePlayersHeader };
