"use client";

import { Home, Trophy, Frown, Handshake, Loader } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";

function GameResult() {
  const { user } = useAuth();
  const { state, opponentDisconnected, requestedPlayAgain, pendingPlayAgainRequest, requestPlayAgain, respondPlayAgain, leaveGame } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const winnerPlayerId = state.winnerPlayerId;
  const userId = user?.id;
  const score = state.score;

  const isDraw = winnerPlayerId === "";
  const isWin = !isDraw && winnerPlayerId === userId;
  const isLoss = !isDraw && winnerPlayerId != null && !isWin;
  const gameOver = isDraw || isWin || isLoss;

  if (pendingPlayAgainRequest) {
    return (
      <GCard padding="lg" className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center text-center z-20">
         <h2 className="text-xl font-black text-text">{t.result.playAgainRequest}</h2>
        <p className="text-text-secondary text-sm mt-2">{pendingPlayAgainRequest.requesterUsername}</p>
        <div className="flex gap-4 mt-8 w-full max-w-xs">
          <GButton onClick={() => respondPlayAgain(true)} className="flex-1">{t.result.accept}</GButton>
          <GButton onClick={() => respondPlayAgain(false)} variant="dangerOutline" className="flex-1">{t.result.reject}</GButton>
        </div>
      </GCard>
    );
  }

  const k = (() => {
    if (isWin) return "win" as const;
    if (isDraw) return "draw" as const;
    if (isLoss) return "loss" as const;
    if (opponentDisconnected) return "forfeit" as const;
    return null;
  })();

  if (!k) return null;

  const IMG = { win: Trophy, draw: Handshake, loss: Frown, forfeit: Trophy };
  const META = {
    win: { iconColor: "warning" as const, textColor: "text-warning" as const, iconClass: undefined, tile: "bg-warning", tileColor: "on-primary" as const },
    draw: { iconColor: "primary" as const, textColor: "text-neon-cyan" as const, iconClass: "text-neon-cyan" as const, tile: "bg-primary", tileColor: "on-primary" as const },
    loss: { iconColor: "danger" as const, textColor: "text-error" as const, iconClass: undefined, tile: "bg-error", tileColor: "on-primary" as const },
    forfeit: { iconColor: "success" as const, textColor: "text-success" as const, iconClass: undefined, tile: "bg-success", tileColor: "on-primary" as const },
  };
  const TITLE = { win: t.result.victory, draw: t.result.draw, loss: t.result.defeat, forfeit: t.result.opponentForfeited };
  const DESC = { win: t.result.victoryDesc, draw: t.result.drawDesc, loss: t.result.defeatDesc, forfeit: t.result.opponentForfeitedDesc };

  const meta = META[k];
  const Icon = IMG[k];
  const sessionEnded = opponentDisconnected && gameOver;

  return (
    <GCard padding="lg" className="absolute inset-0 bg-bg/95 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10">
      <GIcon icon={Icon} size="3xl" tile tileSize="xl" tileGradient={meta.tile} tileColor={meta.tileColor} className="shadow-glow" />
      <h2 className={`text-2xl font-black mt-4 ${meta.textColor}`}>{TITLE[k]}</h2>
      <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">{DESC[k]}</p>
      {score && <p className="text-text-secondary text-xs mt-1">Score: {score[0]} - {score[1]}</p>}
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        {sessionEnded ? (
          <GButton onClick={() => leaveGame()} variant="secondary" className="flex-1" leftIcon={<GIcon icon={Home} size="sm" color="inherit" />}>
            {t.result.backToLobby}
          </GButton>
        ) : requestedPlayAgain ? (
          <GButton disabled className="flex-1">
             <Loader className="animate-spin me-2 h-4 w-4 inline" />
            {t.result.waiting}
          </GButton>
        ) : (
          <GButton onClick={() => requestPlayAgain()} className="flex-1">{t.result.playAgain}</GButton>
        )}
        {!sessionEnded && (
          <GButton onClick={() => leaveGame()} variant="secondary" className="flex-1" leftIcon={<GIcon icon={Home} size="sm" color="inherit" />}>
            {t.result.backToLobby}
          </GButton>
        )}
      </div>
    </GCard>
  );
}

export { GameResult };
