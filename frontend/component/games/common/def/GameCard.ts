export interface IGameCardProps {
  name: string;
  desc: string;
  animation: string;
  path?: string;
  playLabel: string;
  compact?: boolean;
  onPlay?: () => void;
}
