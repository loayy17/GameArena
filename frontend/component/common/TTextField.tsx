"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocale } from "@/Hooks/useTranslation"; // or from your provider
import { ITTextFieldProps } from "./def/TTextField";

export default function TTextField({
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  className,
  error,
  onChange,
}: ITTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locale] = useLocale(); // ← reactive locale

  const inputType = type === "password" && showPassword ? "text" : type;
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          value={value}
          type={inputType}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full rounded-xl border bg-surface px-4 py-2.5 outline-none text-text transition-colors",
            hasError
              ? "border-red-500"
              : focused
                ? "border-primary ring-2 ring-primary/20"
                : "border-border",
            type === "password" ? (locale === "ar" ? "pl-12" : "pr-12") : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={[
              "absolute top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600",
              locale === "ar" ? "left-3" : "right-3",
            ].join(" ")}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
