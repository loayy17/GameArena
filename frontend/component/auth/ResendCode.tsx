"use client";

import { useState } from "react";
import type { IResendCodeProps } from "./def/ResendCode";
import { TButton } from "../common/TButton";

function ResendCode({ onResend, label }: IResendCodeProps) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    try {
      setLoading(true);
      await onResend();
    } finally {
      setLoading(false);
    }
  };

  return (
    <TButton
      variant="ghost"
      disabled={loading}
      onClick={handle}
      className="text-sm text-primary hover:underline disabled:opacity-50"
    >
      {loading ? "..." : label}
    </TButton>
  );
}

export { ResendCode };
