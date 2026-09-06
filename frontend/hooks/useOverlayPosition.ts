import { useCallback, useEffect, useRef, useState } from "react";

interface IOverlayContext {
  viewportWidth: number;
  viewportHeight: number;
  rtl: boolean;
}

type TOverlayCompute<TOutput> = (anchor: DOMRect, floating: DOMRect, ctx: IOverlayContext) => TOutput;

interface IUseOverlayPositionOptions<TOutput> {
  open: boolean;
  compute: TOverlayCompute<TOutput>;
  mode?: "track" | "close";
}

function useOverlayPosition<TOutput, TAnchor extends HTMLElement = HTMLElement, TFloating extends HTMLElement = HTMLElement>({
  open,
  compute,
  mode = "track",
}: IUseOverlayPositionOptions<TOutput>) {
  const anchorRef = useRef<TAnchor | null>(null);
  const floatingRef = useRef<TFloating | null>(null);
  const [layout, setLayout] = useState<TOutput | null>(null);
  const output = open ? layout : null;

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const ctx: IOverlayContext = {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      rtl: document.documentElement.dir === "rtl",
    };
    setLayout(compute(anchor.getBoundingClientRect(), floating.getBoundingClientRect(), ctx));
  }, [compute]);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(update);
    const handleScroll = () => {
      if (mode === "close") setLayout(null);
      else update();
    };

    window.addEventListener("resize", update);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, update, mode]);

  return { anchorRef, floatingRef, output };
}

export { useOverlayPosition };
