import { useId } from "react";

interface IUseFieldOptions {
  id?: string;
  name?: string;
  prefix: string;
  error?: string;
  hint?: string;
}

function useField({ id, name, prefix, error, hint }: IUseFieldOptions) {
  const autoId = useId();
  const inputId = id ?? `${prefix}-${name ?? autoId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return {
    inputId,
    describedBy,
    invalid: error ? true : undefined,
    errorProps: errorId ? { id: errorId, role: "alert" as const } : {},
    hintProps: hintId ? { id: hintId } : {},
  };
}

export { useField };
