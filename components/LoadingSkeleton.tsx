export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center py-10">
        <div className="skeleton h-4 w-32 mx-auto mb-4 rounded" />
        <div className="skeleton h-16 w-64 mx-auto mb-4 rounded" />
        <div className="skeleton h-6 w-48 mx-auto rounded" />
      </div>

      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="glow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div>
                <div className="skeleton h-4 w-32 mb-2 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
            <div className="skeleton h-6 w-20 rounded" />
          </div>
          <div className="skeleton h-4 w-full mb-2 rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}
