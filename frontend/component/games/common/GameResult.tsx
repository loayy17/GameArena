"use client";

import type React from "react";
import { Home, Trophy, Frown, Handshake, Loader } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import type { GameResultProps } from "./def/GameResult";

function GameResult({
  winnerPlayerId,
  userId,
  opponentDisconnected,
  score,
  t,
  endT,
  onPlayAgain,
  onLobby,
  requestedPlayAgain,
  onRespondPlayAgain,
  pendingRequest,
}: GameResultProps) {
  const isDraw = winnerPlayerId === "";
  const isWin = !isDraw && winnerPlayerId === userId;
  const isLoss = !isDraw && winnerPlayerId != null && !isWin;

  // ── Play Again request dialog ──────────────────────────────────────
  if (pendingRequest) {
    return (
      <GCard padding="lg" className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center text-center z-20">
        <h2 className="text-xl font-black text-text-primary">{endT.playAgainRequest}</h2>
        <p className="text-text-secondary text-sm mt-2">
          {pendingRequest.requesterUsername}
        </p>
        <div className="flex gap-4 mt-8 w-full max-w-xs">
          <GButton onClick={() => onRespondPlayAgain?.(true)} className="flex-1">
            {endT.accept}
          </GButton>
          <GButton
            onClick={() => onRespondPlayAgain?.(false)}
            variant="dangerOutline"
            className="flex-1"
          >
            {endT.reject}
          </GButton>
        </div>
      </GCard>
    );
  }

  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let color: string;

  if (opponentDisconnected) {
    icon = <GIcon icon={Trophy} size="4xl" color="success" />;
    title = t.opponentForfeited;
    description = t.opponentForfeitedDesc;
    color = "text-success";
  } else if (isWin) {
    icon = <GIcon icon={Trophy} size="4xl" color="warning" />;
    title = t.victory;
    description = t.victoryDesc;
    color = "text-warning";
  } else if (isDraw) {
    icon = <GIcon icon={Handshake} size="4xl" color="primary" className="text-neon-cyan" />;
    title = t.draw;
    description = t.drawDesc;
    color = "text-neon-cyan";
  } else if (isLoss) {
    icon = <GIcon icon={Frown} size="4xl" color="danger" />;
    title = t.defeat;
    description = t.defeatDesc;
    color = "text-error";
  } else {
    return null;
  }

  return (
    <GCard padding="lg" className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center text-center z-10">
      {icon}
      <h2 className={`text-2xl font-black mt-4 ${color}`}>{title}</h2>
      <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">
        {description}
      </p>
      {score && (
        <p className="text-text-secondary text-xs mt-1">
          Score: {score[0]} - {score[1]}
        </p>
      )}
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        {requestedPlayAgain ? (
          <GButton disabled className="flex-1">
            <Loader className="animate-spin mr-2 h-4 w-4 inline" />
            {endT.waiting}
          </GButton>
        ) : (
          <GButton onClick={onPlayAgain} className="flex-1">
            {endT.playAgain}
          </GButton>
        )}
        <GButton
          onClick={onLobby}
          variant="secondary"
          className="flex-1"
          leftIcon={<GIcon icon={Home} size="sm" color="inherit" />}
        >
          {endT.lobby}
        </GButton>
      </div>
    </GCard>
  );
}

export { GameResult };
