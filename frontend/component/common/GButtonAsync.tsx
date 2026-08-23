"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { GButton } from "./GButton";
import { GSpinner } from "./GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IGButtonAsyncProps } from "./def/GButtonAsync";

const GButtonAsync = forwardRef<HTMLButtonElement, IGButtonAsyncProps>(
  ({ onClick, busy, disabled, children, loadingText, startIcon, endIcon, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const isBusy = Boolean(busy) || pending;

    const handleClick = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick || isBusy) return;
        setPending(true);
        try {
          await onClick(event);
        } finally {
          if (mountedRef.current) setPending(false);
        }
      },
      [onClick, isBusy],
    );

    return (
      <GButton ref={ref} disabled={disabled || isBusy} startIcon={startIcon} endIcon={endIcon} onClick={handleClick} {...props}>
        {isBusy ? (
          <>
            <GSpinner size={SizeEnum.sm} />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </GButton>
    );
  },
);

GButtonAsync.displayName = "GButtonAsync";

export { GButtonAsync };
