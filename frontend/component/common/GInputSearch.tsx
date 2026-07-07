"use client";

import { Search, X } from "lucide-react";
import { GIcon } from "./GIcon";
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
    <GTextField
      id="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      label={label}
      startIcon={<GIcon icon={Search} size="sm" color="muted" />}
      endIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={clearLabel || "Clear search"}
            className="text-text-muted hover:text-text"
          >
            <GIcon icon={X} size="sm" color="muted" flip={false} />
          </button>
        ) : undefined
      }
    />
  );
}
