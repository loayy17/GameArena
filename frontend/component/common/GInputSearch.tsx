"use client";

import { Search, X } from "lucide-react";
import { GTextField } from "./GTextField";
import type { GInputSearchProps } from "./def/GInputSearch";

export function GInputSearch({
  value,
  onChange,
  placeholder,
  label,
  onClear,
  clearLabel,
}: GInputSearchProps) {
  return (
    <div className="relative">
      {label && (
        <label htmlFor="search" className="sr-only">
          {label}
        </label>
      )}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <GTextField
        id="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
        endIcon={
          value && onClear ? (
            <button
              onClick={onClear}
              aria-label={clearLabel || "Clear search"}
              className="text-text-muted hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
