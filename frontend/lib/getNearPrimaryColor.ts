/** Palette near primary (#7c6cf0) — stable per seed, not random each render */
const NEAR_PRIMARY_COLORS = [
  "#7c6cf0",
  "#8b7cf5",
  "#6b5ad8",
  "#9a6ee8",
  "#6c7cf0",
  "#8560e8",
  "#a070f0",
  "#7068e0",
] as const;

function getNearPrimaryColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return NEAR_PRIMARY_COLORS[Math.abs(hash) % NEAR_PRIMARY_COLORS.length];
}

export { getNearPrimaryColor, NEAR_PRIMARY_COLORS };
