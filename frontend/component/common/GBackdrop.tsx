import type { GBackdropProps } from "./def/GBackdrop";

function GBackdrop({ onClick }: GBackdropProps) {
  return <div className="drawer-backdrop" onClick={onClick} />;
}
export { GBackdrop };
