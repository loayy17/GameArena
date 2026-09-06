"use client";

import { Bot, User, Zap } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GSpinner } from "@/component/common/GSpinner";
import { getGameConfig } from "@/domain/constant/games";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { TNullable, TOptional } from "@/domain/type/TCommon";
import type { IGamePlayersHeaderProps, IGameTurnIndicatorProps, IPlayerCardProps, TPlayerResult } from "./def/GameUI";

const RESULT_STYLES: Record<TPlayerResult, { badge: string }> = {
  win: { badge: "bg-success/10 text-success border border-success/30 shadow-sm shadow-success/10" },
  loss: { badge: "bg-danger/10 text-danger border border-danger/30 shadow-sm shadow-danger/10" },
  draw: { badge: "bg-surface text-text-secondary border border-border" },
};

function PlayerCard({ playerId, playerUsername, symbol, isBot, fallbackName, isTurn, symbolColors, score, result }: IPlayerCardProps) {
  const { user } = useAuth();
  const t = useGameTranslation();

  const isYou = playerId === user?.id;
  const myName = user?.userName ?? t.game.you;
  const name = isYou ? `${myName} ${t.game.youSuffix}` : isBot ? t.game.aiBot : playerUsername || fallbackName;
  const resultLabel = result === "win" ? t.result.winShort : result === "loss" ? t.result.loseShort : t.result.drawShort;

  return (
    <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
      <div
        className={cn(
          "relative size-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border-2",
          result === "win"
            ? "border-success bg-success/10 ring-2 ring-success/20 shadow-lg shadow-success/15"
            : isTurn && symbolColors
              ? symbolColors.box
              : "border-border-light bg-surface",
        )}>
        {isBot ? (
          <GIcon icon={Bot} size={SizeEnum.xl} className={symbol === "X" ? "text-primary" : "text-accent"} />
        ) : (
          <GIcon icon={User} size={SizeEnum.xl} color={AccentColorEnum.Secondary} />
        )}
        {symbol && symbolColors && (
          <span
            className={cn(
              "absolute -top-2 -end-2 size-6 rounded-full text-on-primary text-xs font-bold flex items-center justify-center shadow-sm",
              symbolColors.badge,
            )}>
            {symbol}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-text mt-3 truncate max-w-28">{name}</span>
      {isTurn && symbolColors && <span className={cn("text-xs font-medium mt-1", symbolColors.turn)}>{t.game.turn}</span>}
      {score !== undefined && <span className="text-xs font-medium mt-1 text-text-muted">{score}</span>}
      {result && (
        <span className={cn("mt-1.5 text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border", RESULT_STYLES[result].badge)}>
          {resultLabel}
        </span>
      )}
    </div>
  );
}

function GameTurnIndicator({ isMyTurn, currentTurnText, waitingText, thinking }: IGameTurnIndicatorProps) {
  return (
    <div
      className={cn(
        "w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2",
        isMyTurn ? "bg-primary/10 border-primary/30 text-text shadow-sm shadow-primary/10" : "bg-surface border-border text-text-secondary",
      )}>
      {thinking && !isMyTurn ? (
        <GSpinner size={SizeEnum.sm} />
      ) : (
        <GIcon icon={Zap} size={SizeEnum.sm} className={isMyTurn ? "text-primary" : "text-text-muted"} />
      )}
      {isMyTurn ? currentTurnText : waitingText}
    </div>
  );
}

function GamePlayersHeader({ gameType }: IGamePlayersHeaderProps) {
  const { user } = useAuth();
  const { state, lastGameType } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const effectiveGameType = gameType ?? lastGameType;
  if (effectiveGameType == null) return null;

  const { isBotGame: bot, hasStarted, player1Id, player1Username, player2Id, player2Username, currentTurnPlayerId, isFinished } = state;
  const isBotGame = bot && hasStarted;
  const isLobby = !player2Id;
  const gameInfo = getGameConfig(effectiveGameType);
  const roundOver = state.winnerPlayerId != null || isFinished === true;
  const p1IsTurn = currentTurnPlayerId === player1Id && hasStarted && !roundOver;
  const p2IsTurn = currentTurnPlayerId === player2Id && hasStarted && !roundOver;

  const getPlayerResult = (playerId: TOptional<string>): TNullable<TPlayerResult> => {
    if (!roundOver) return null;
    const winner = state.winnerPlayerId;
    if (winner === "") return "draw";
    if (winner === playerId) return "win";
    if (winner != null) return "loss";
    return null;
  };

  const p1Result = getPlayerResult(player1Id);
  const p2Result = getPlayerResult(player2Id);

  return (
    <GCard className="grid grid-cols-7 items-center p-3">
      <PlayerCard
        playerId={player1Id ?? null}
        playerUsername={player1Username ?? null}
        symbol={gameInfo.symbol1}
        isBot={isBotGame && player1Id !== user?.id}
        fallbackName={t.game.player1}
        isTurn={p1IsTurn}
        symbolColors={gameInfo.player1Colors}
        score={state.score ? state.score[0] : undefined}
        result={p1Result}
      />
      <div className="col-span-1 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-text-muted">{t.game.vs}</span>
        <div className="w-px h-10 bg-border/40 mt-1" />
      </div>
      <PlayerCard
        playerId={player2Id ?? null}
        playerUsername={player2Username ?? null}
        symbol={isLobby ? "?" : gameInfo.symbol2}
        isBot={isBotGame && player2Id !== user?.id}
        fallbackName={isLobby ? t.game.waiting : t.game.player2}
        isTurn={p2IsTurn}
        symbolColors={isLobby ? undefined : gameInfo.player2Colors}
        score={state.score ? state.score[1] : undefined}
        result={p2Result}
      />
    </GCard>
  );
}

export { GameTurnIndicator, GamePlayersHeader };
