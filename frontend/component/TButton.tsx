"use client";

import { TButtonProps } from "./def/TButton";

function TButton({
  title,
  type = "button",
  disabled = false,
  loading = false,
  required = false,
  validationMessage,
  className = "",
  style,
  onClick,
}: TButtonProps) {
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    onClick?.(e);
  };

  return (
    <div className="w-full">
      <button
        type={type}
        disabled={isDisabled}
        onClick={handleClick}
        style={style}
        className={`
          w-full
          rounded-xl
          px-5
          py-3
          font-medium
          transition-all
          duration-200
          active:scale-[0.98]

          ${
            isDisabled
              ? "bg-gray-500/40 text-gray-300 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }

          ${className}
        `}
      >
        <div className="flex items-center justify-center gap-2">
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}

          <span>{title}</span>

          {required && (
            <span className="text-red-400 font-bold" title="Required">
              *
            </span>
          )}
        </div>
      </button>

      {validationMessage && (
        <p className="mt-2 text-xs text-red-500">{validationMessage}</p>
      )}
    </div>
  );
}

export default TButton;
