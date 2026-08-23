"use client";

import { Home } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GIcon } from "@/component/common/GIcon";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable, TOptional } from "@/domain/type/TCommon";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GamePlayersHeader, GameTurnIndicator } from "./GameUI";
import type { IGameActiveProps } from "./def/GameActive";

function getResultKind(winnerPlayerId: TOptional<string>, userId: TOptional<string>, opponentDisconnected: boolean): TNullable<string> {
  if (winnerPlayerId === "") return "draw";
  if (winnerPlayerId === userId) return "win";
  if (winnerPlayerId != null) return "loss";
  if (opponentDisconnected) return "forfeit";
  return null;
}

function GameActive({ children, gameType }: IGameActiveProps) {
  const { user } = useAuth();
  const { state, leaveGame, requestedPlayAgain, requestPlayAgain, respondPlayAgain, pendingPlayAgainRequest, opponentDisconnected } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const isOver = state.winnerPlayerId != null || state.isFinished === true;
  const resultKind = getResultKind(state.winnerPlayerId, user?.id, opponentDisconnected);
  const sessionEnded = opponentDisconnected && resultKind !== "forfeit";
  const isMyTurn = state.currentTurnPlayerId === user?.id;
  const opponentName = state.isBotGame
    ? t.game.aiBot
    : state.player1Id === user?.id
      ? state.player2Username || t.game.opponent
      : state.player1Username || t.game.opponent;

  const backToLobbyButton = (
    <GButtonAsync
      onClick={() => leaveGame()}
      variant={ButtonVariantEnum.Secondary}
      className="flex-1"
      startIcon={<GIcon icon={Home} size={SizeEnum.sm} />}>
      {t.result.backToLobby}
    </GButtonAsync>
  );

  return (
    <div className="flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-xl space-y-4 sm:space-y-6">
        <GamePlayersHeader gameType={gameType} />

        {!isOver && (
          <GameTurnIndicator
            isMyTurn={isMyTurn}
            currentTurnText={t.game.yourTurn}
            waitingText={state.isBotGame ? t.game.botThinking.replace("{name}", opponentName) : t.game.waitingFor.replace("{name}", opponentName)}
            thinking={state.isBotGame && !isMyTurn}
          />
        )}
        <div>{children}</div>
        {!isOver ? (
          <div className="flex justify-center">
            <GButtonAsync onClick={() => leaveGame()} variant={ButtonVariantEnum.Danger} size={SizeEnum.sm}>
              {t.game.leaveGame}
            </GButtonAsync>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-8">
            {pendingPlayAgainRequest && (
              <p className="text-sm text-text-secondary">
                {pendingPlayAgainRequest.requesterUsername} {t.result.playAgainRequest}
              </p>
            )}
            <div className="flex gap-4 w-full max-w-xs">
              {pendingPlayAgainRequest ? (
                <>
                  <GButtonAsync onClick={() => respondPlayAgain(true)} className="flex-1">
                    {t.result.accept}
                  </GButtonAsync>
                  <GButtonAsync onClick={() => respondPlayAgain(false)} variant={ButtonVariantEnum.Danger} className="flex-1">
                    {t.result.reject}
                  </GButtonAsync>
                </>
              ) : sessionEnded ? (
                backToLobbyButton
              ) : requestedPlayAgain ? (
                <GButtonAsync busy loadingText={t.result.waiting} className="flex-1">
                  {t.result.waiting}
                </GButtonAsync>
              ) : (
                <GButtonAsync onClick={() => requestPlayAgain()} className="flex-1">
                  {t.result.playAgain}
                </GButtonAsync>
              )}
              {!sessionEnded && !pendingPlayAgainRequest && backToLobbyButton}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { GameActive };
