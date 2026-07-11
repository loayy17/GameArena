"use client";

import clsx from "clsx";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GCard } from "@/component/common/GCard";
import type { ITicTacToeGameState } from "@/app/providers/def/IGameState";

const EMPTY = ".";
const PLAYER_X = "X";
const PLAYER_O = "O";
const ACTION_MAKE_MOVE = "MAKE_MOVE";

function TicTacToePage() {
  const { user } = useAuth();
  const { state, sendAction } = useGame();

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>{null}</GameLayoutWrapper>;
  }

  const tttState = state as ITicTacToeGameState;
  const { board, isFinished } = tttState;
  const myPlayerId = user?.id;
  const isMyTurn = tttState.currentTurnPlayerId === myPlayerId;

  const isCellOccupied = (cell: string): boolean => cell === PLAYER_X || cell === PLAYER_O;
  const isCellPlayable = (cell: string): boolean => !isCellOccupied(cell) && isMyTurn && !isFinished;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>
      <GCard padding="md" rounded="3xl" className="grid grid-cols-3 gap-3">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => sendAction({ type: ACTION_MAKE_MOVE, cell: index })}
            disabled={!isCellPlayable(cell)}
            className={clsx(
              "aspect-square flex items-center justify-center text-4xl font-bold border-2 rounded-md transition-colors duration-150",
              cell === PLAYER_X && "text-accent bg-accent-muted border-accent/40",
              cell === PLAYER_O && "text-warning bg-warning-bg border-warning/40",
              cell === EMPTY && "bg-surface border-border-light hover:border-primary/40 hover:bg-primary-muted cursor-pointer",
            )}>
            {cell === PLAYER_X && <span className="text-accent">{PLAYER_X}</span>}
            {cell === PLAYER_O && <span className="text-warning">{PLAYER_O}</span>}
          </button>
        ))}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default TicTacToePage;
