interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyState = ({
  icon,
  title,
  description,
  children,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-text-muted mb-4">{icon}</div>
    <h3 className="text-text text-lg font-semibold mb-1">{title}</h3>
    <p className="text-text-secondary text-sm max-w-sm">{description}</p>
    {children}
  </div>
);

export { EmptyState };
