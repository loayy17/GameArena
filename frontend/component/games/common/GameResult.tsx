"use client";

import type React from "react";
import { Home, Trophy, Frown, Handshake } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import type { GameResultProps } from "./def/GameResult";

function GameResult({
  winnerPlayerId,
  isFinished,
  userId,
  opponentDisconnected,
  t,
  endT,
  onPlayAgain,
  onLobby,
}: GameResultProps) {
  const isWin = winnerPlayerId === userId;
  const isDraw = isFinished && !winnerPlayerId;
  const isLoss = isFinished && !isWin && !isDraw && !opponentDisconnected;

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
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        <GButton onClick={onPlayAgain} className="flex-1">
          {endT.playAgain}
        </GButton>
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
