import type { RPSChoice } from "@/app/providers/def/IGameState";

interface IRevealPanelProps {
  label: string;
  choice?: RPSChoice;
  placeholder: string;
  isWinner: boolean;
}

export type { IRevealPanelProps };
