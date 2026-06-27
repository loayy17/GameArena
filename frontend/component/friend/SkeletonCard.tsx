function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-gray-700 mb-2" />
      <div className="h-4 w-24 bg-gray-700 rounded mb-1" />
      <div className="h-3 w-16 bg-gray-700 rounded mb-4" />
      <div className="flex gap-2 w-full">
        <div className="flex-1 h-9 bg-gray-700 rounded" />
        <div className="flex-1 h-9 bg-gray-700 rounded" />
      </div>
    </div>
  );
}
export { SkeletonCard };
