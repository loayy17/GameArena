"use client";

import { cn } from "@/lib/cn";
import { isTicTacToeState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { GameActionTypes, BOARD_EMPTY, PLAYER_O, PLAYER_X } from "@/domain/constant/games";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { useGameStateView } from "@/hooks/useGameStateView";

function TicTacToePage() {
  const { state, sendAction } = useGame();
  const { isMyTurn, isOver } = useGameStateView(state);
  const t = useGameTranslation();

  if (!isTicTacToeState(state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>{null}</GameLayoutWrapper>;
  }

  const { board, player1Score, player2Score, winScore } = state;

  const winningCells = new Set(state.winningCells?.map(Number) ?? []);

  const isCellPlayable = (cell: string): boolean => cell === BOARD_EMPTY && isMyTurn && !isOver;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>
      <GCard className="p-4">
        <ScoreBoard
          className="mb-5"
          winScore={winScore}
          left={{ score: player1Score, label: PLAYER_X, colorClass: "text-primary" }}
          right={{ score: player2Score, label: PLAYER_O, colorClass: "text-accent" }}
        />
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-game-board-border shadow-inner p-2">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => {
              const playable = isCellPlayable(cell);
              const isWinning = winningCells.has(index);
              return (
                <GButton
                  key={index}
                  variant={ButtonVariantEnum.Subtle}
                  size={SizeEnum.None}
                  disabled={!playable}
                  onClick={() => sendAction({ type: GameActionTypes.MAKE_MOVE, cell: index })}
                  aria-label={t.tictactoe.cellLabel(index + 1)}
                  className={cn(
                    "flex aspect-square w-full items-center justify-center rounded-xl bg-surface",
                    playable && "cursor-pointer hover:bg-primary-muted",
                    !playable && "cursor-default",
                    isWinning && "bg-success-muted ring-2 ring-inset ring-success/60",
                  )}>
                  {cell !== BOARD_EMPTY && (
                    <span className={cn("animate-scale-in text-5xl font-extrabold sm:text-6xl", cell === PLAYER_X ? "text-primary" : "text-accent")}>
                      {cell}
                    </span>
                  )}
                </GButton>
              );
            })}
          </div>
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default TicTacToePage;
