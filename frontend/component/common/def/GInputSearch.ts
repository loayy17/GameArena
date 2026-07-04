interface GInputSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  onClear?: () => void;
  clearLabel?: string;
}

export type { GInputSearchProps };
