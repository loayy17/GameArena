function SkeletonRow() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 animate-pulse flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-700" />
        <div>
          <div className="h-4 w-32 bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-700 rounded mt-1" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full" />
        <div className="w-8 h-8 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}
export { SkeletonRow };
