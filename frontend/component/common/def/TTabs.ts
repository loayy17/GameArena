export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
}
