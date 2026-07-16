"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { GamePlayersHeader } from "@/component/games/common/GamePlayersHeader";
import { GameTurnIndicator } from "@/component/games/common/GameTurnIndicator";
import { GameResult } from "@/component/games/common/GameResult";
import { GButton } from "@/component/common/GButton";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { GameInfo } from "./gameConfig";
import type { GameActiveProps } from "./def/GameActive";

function GameActive({ state, gameInfo, t, opponentDisconnected, children, onPlayAgain, onLobby, onLeave, requestedPlayAgain, onRespondPlayAgain, pendingRequest }: GameActiveProps) {
  const { user } = useAuth();
  const isBotGame = state.isBotGame;
  const opponentName = isBotGame
    ? t.game.aiBot
    : state.player1Id === user?.id
      ? state.player2Username || t.game.opponent
      : state.player1Username || t.game.opponent;

  const player1IsTurn = state.currentTurnPlayerId === state.player1Id && !state.isFinished;
  const player2IsTurn = state.currentTurnPlayerId === state.player2Id && !state.isFinished;
  const isMyTurn = state.currentTurnPlayerId === user?.id;
  const myName = user?.userName ?? t.game.you;

  return (
    <div className="flex items-center justify-center min-h-150 p-4">
      <div className="w-full max-w-lg space-y-6">
        <GamePlayersHeader
          player1={{
            id: state.player1Id,
            username: state.player1Username,
            isTurn: player1IsTurn,
            isYou: state.player1Id === user?.id,
          }}
          player2={{
            id: state.player2Id,
            username: state.player2Username,
            isTurn: player2IsTurn,
            isYou: state.player2Id === user?.id,
          }}
          player1Symbol={gameInfo.symbol1}
          player2Symbol={gameInfo.symbol2}
          isBotGame={isBotGame}
          currentUserId={user?.id}
          myName={myName}
          player1Fallback={t.game.player1}
          player2Fallback={t.game.player2}
          vsLabel={t.game.vs}
          youSuffix={t.game.youSuffix}
          aiBotLabel={t.game.aiBot}
          turnLabel={t.game.turn}
          player1Colors={gameInfo.player1Colors}
          player2Colors={gameInfo.player2Colors}
        />

        {!(state.winnerPlayerId || state.isFinished) && (
          <GameTurnIndicator
            isMyTurn={isMyTurn}
            currentTurnText={t.game.yourTurn}
            waitingText={t.game.waitingFor.replace("{name}", opponentName)}
          />
        )}

        <div className="relative">
          {children}

          <GameResult
            winnerPlayerId={state.winnerPlayerId}
            userId={user?.id}
            opponentDisconnected={opponentDisconnected}
            score={state.score}
            t={{
              opponentForfeited: t.result.opponentForfeited,
              opponentForfeitedDesc: t.result.opponentForfeitedDesc,
              victory: t.result.victory,
              victoryDesc: t.result.victoryDesc,
              draw: t.result.draw,
              drawDesc: t.result.drawDesc,
              defeat: t.result.defeat,
              defeatDesc: t.result.defeatDesc,
            }}
            endT={{
              playAgain: t.result.playAgain,
              lobby: t.result.backToLobby,
              waiting: t.result.waiting,
              accept: t.result.accept,
              reject: t.result.reject,
              playAgainRequest: t.result.playAgainRequest,
            }}
            onPlayAgain={onPlayAgain}
            onLobby={onLobby}
            requestedPlayAgain={requestedPlayAgain}
            onRespondPlayAgain={onRespondPlayAgain}
            pendingRequest={pendingRequest}
          />
        </div>

        {!(state.winnerPlayerId || state.isFinished) && (
          <div className="flex justify-center">
            <GButton onClick={onLeave} variant="dangerOutline" size="sm">
              {t.game.leaveGame}
            </GButton>
          </div>
        )}
      </div>
    </div>
  );
}

export { GameActive };
