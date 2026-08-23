"use client";

import { cn } from "@/lib/cn";

import type { IGameState, RPSChoice } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { RPS_CHOICE_EMOJI, RPS_CHOICES } from "@/domain/constant/game-constants";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameStateView } from "@/hooks/useGameStateView";
import { useGameTranslation } from "@/hooks/useGameTranslation";

type RPSState = IGameState & { player1Choice?: RPSChoice; player2Choice?: RPSChoice };

const CHOICE_ITEMS = RPS_CHOICES.map((choice) => ({
  id: choice,
  labelKey: choice.toLowerCase() as "rock" | "paper" | "scissors",
  emoji: RPS_CHOICE_EMOJI[choice],
}));

function RevealPanel({ label, choice, placeholder, isWinner }: { label: string; choice?: RPSChoice; placeholder: string; isWinner: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border py-4 transition-colors",
        isWinner ? "border-success/50 bg-success-bg" : "border-border/60 bg-bg-card",
      )}>
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      <span key={choice ?? placeholder} className="animate-scale-in text-4xl sm:text-5xl">
        {choice ? RPS_CHOICE_EMOJI[choice] : placeholder}
      </span>
    </div>
  );
}

function RockPaperScissorsPage() {
  const { state, sendAction } = useGame();
  const t = useGameTranslation();
  const { myPlayerId, isPlayer1, isMyTurn, isOver } = useGameStateView(state);

  if (!state || !("winScore" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.RockPaperScissors}>{null}</GameLayoutWrapper>;
  }

  const rpsState = state as RPSState;
  const myChoice = isPlayer1 ? rpsState.player1Choice : rpsState.player2Choice;
  const rawOppChoice = isPlayer1 ? rpsState.player2Choice : rpsState.player1Choice;
  const myScore = isPlayer1 ? rpsState.player1Score : rpsState.player2Score;
  const oppScore = isPlayer1 ? rpsState.player2Score : rpsState.player1Score;
  const oppChoice = myChoice ? rawOppChoice : undefined;
  const canPick = isMyTurn && !isOver && !myChoice;

  const handleChoice = (choice: string) => {
    if (!canPick) return;
    sendAction({ type: GameActionTypes.MAKE_MOVE, choice });
  };

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.RockPaperScissors}>
      <GCard padding={SizeEnum.md}>
        <ScoreBoard
          className="mb-5"
          winScore={rpsState.winScore}
          left={{ score: myScore, label: t.game.you, colorClass: "text-accent" }}
          right={{ score: oppScore, label: t.game.opponent, colorClass: "text-warning" }}
        />

        <div className="grid grid-cols-3 gap-3">
          {CHOICE_ITEMS.map(({ id, labelKey, emoji }) => (
            <button
              key={id}
              type="button"
              disabled={!canPick}
              onClick={() => handleChoice(id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-2xl border py-6 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                myChoice === id
                  ? "border-primary bg-primary-muted ring-2 ring-primary/40"
                  : canPick
                    ? "cursor-pointer border-border-light bg-surface hover:border-primary/40 hover:bg-primary/5"
                    : "cursor-default border-border/60 bg-surface opacity-60",
              )}>
              <span className="text-4xl sm:text-5xl">{emoji}</span>
              <span className="text-xs font-semibold text-text-secondary">{t.rockpaperscissors[labelKey]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <RevealPanel label={t.game.you} choice={myChoice} placeholder="❔" isWinner={isOver && rpsState.winnerPlayerId === myPlayerId} />
          <span className="text-lg font-extrabold text-text-muted">{t.game.vs}</span>
          <RevealPanel
            label={t.game.opponent}
            choice={oppChoice}
            placeholder={myChoice ? "⏳" : "❔"}
            isWinner={isOver && rpsState.winnerPlayerId != null && rpsState.winnerPlayerId !== "" && rpsState.winnerPlayerId !== myPlayerId}
          />
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default RockPaperScissorsPage;
