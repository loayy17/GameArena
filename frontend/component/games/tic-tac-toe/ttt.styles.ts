/** Tic-tac-toe scoped styles — no shadows, no decorative animation */
import { rounded } from "@/component/common/tokens";

const ttt = {
  page: "flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full py-8 px-4 md:px-8",
  panel: `w-full max-w-md bg-bg-card border border-border ${rounded.lg} p-8 text-center`,
  panelLg: `w-full max-w-lg bg-bg-card border border-border ${rounded.lg} p-8 text-center`,
  iconTile: `flex items-center justify-center w-16 h-16 ${rounded.md} bg-primary/15`,
  playerAvatar: `relative w-16 h-16 ${rounded.md} flex items-center justify-center border-2 border-primary bg-primary-muted`,
  xSymbolBox: `w-20 h-20 ${rounded.md} flex items-center justify-center border-2 border-accent bg-accent-muted`,
  oSymbolBox: `w-20 h-20 ${rounded.md} flex items-center justify-center border-2 border-warning bg-warning-bg`,
  symbol: "text-3xl font-bold",
  playerXActive: "border-accent bg-accent-muted",
  playerOActive: "border-warning bg-warning-bg",
  badgeX: "absolute -top-2 -end-2 w-6 h-6 rounded-full bg-accent text-on-primary text-xs font-bold flex items-center justify-center",
  badgeO: "absolute -top-2 -end-2 w-6 h-6 rounded-full bg-warning text-on-primary text-xs font-bold flex items-center justify-center",
  turnX: "text-xs font-medium text-accent",
  turnO: "text-xs font-medium text-warning",
  cellX: "text-accent bg-accent-muted border-accent/40",
  cellO: "text-warning bg-warning-bg border-warning/40",
  cellBase: `aspect-square flex items-center justify-center text-4xl font-bold border-2 ${rounded.md} cursor-pointer`,
  scoreBar: `grid grid-cols-7 items-center bg-bg-card border border-border ${rounded.lg} p-4`,
  accentBar: "absolute top-0 inset-x-0 h-0.5 bg-primary",
  friendsList: `flex-1 overflow-y-auto max-h-60 custom-scrollbar bg-surface-alt border border-border ${rounded.md} p-2`,
  maxPlayerName: "max-w-[7rem]",
} as const;

export { ttt };
