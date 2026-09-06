"use client";

import { cn } from "@/lib/cn";
import { isConnectFourState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { GameActionTypes, dropRow } from "@/domain/constant/games";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CellEnum } from "@/domain/enum/CellEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameStateView } from "@/hooks/useGameStateView";
import { useGameTranslation } from "@/hooks/useGameTranslation";

function ConnectFourPage() {
  const { state, sendAction } = useGame();
  const t = useGameTranslation();
  const { isPlayer1, isMyTurn, isOver } = useGameStateView(state);

  if (!isConnectFourState(state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>{null}</GameLayoutWrapper>;
  }

  const { board, player1Score, player2Score, winScore } = state;
  const rows = board[0]?.length ?? 0;

  const winningCells = new Set(state.winningCells ?? []);
  const previewClass = isPlayer1 ? "group-hover:bg-accent/40" : "group-hover:bg-warning/40";

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>
      <GCard className="p-4">
        <ScoreBoard
          className="mb-5"
          winScore={winScore}
          left={{ score: player1Score, label: state.player1Username || t.game.player1, colorClass: "text-accent" }}
          right={{ score: player2Score, label: state.player2Username || t.game.player2, colorClass: "text-warning" }}
        />

        <div className="mx-auto w-full max-w-lg rounded-2xl border border-game-board-border bg-game-board p-2.5 shadow-inner">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {board.map((column, col) => {
              const targetRow = dropRow(column);
              const playable = isMyTurn && !isOver && targetRow >= 0;
              return (
                <GButton
                  key={col}
                  variant={ButtonVariantEnum.Subtle}
                  size={SizeEnum.None}
                  disabled={!playable}
                  onClick={() => sendAction({ type: GameActionTypes.PLACE, col })}
                  aria-label={t.connectfour.dropColumnLabel(col + 1)}
                  className={cn(
                    "group flex w-full flex-col items-stretch gap-1.5 rounded-xl p-0.5 sm:gap-2",
                    playable ? "cursor-pointer hover:bg-primary/10" : "cursor-default",
                  )}>
                  {Array.from({ length: rows }, (_, row) => {
                    const value = column[row];
                    const isPreview = playable && row === targetRow;
                    return (
                      <span
                        key={row}
                        className={cn(
                          "block aspect-square rounded-full",
                          value === CellEnum.None && (isPreview ? `bg-bg-card ${previewClass}` : "bg-bg-card"),
                          value === CellEnum.PlayerOne && "animate-scale-in bg-accent",
                          value === CellEnum.PlayerTwo && "animate-scale-in bg-warning",
                          winningCells.has(`${col}-${row}`) && "ring-2 ring-inset ring-success",
                        )}
                      />
                    );
                  })}
                </GButton>
              );
            })}
          </div>
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default ConnectFourPage;
