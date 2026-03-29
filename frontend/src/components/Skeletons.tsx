interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-10 w-20" />
      <SkeletonBlock className="h-3 w-32" />
    </div>
  );
}

export function SkeletonGauge() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="skeleton-shimmer rounded-full w-[200px] h-[200px]" />
      <SkeletonBlock className="h-4 w-20" />
    </div>
  );
}

export function SkeletonDimensionCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-surface-2 rounded-xl p-4 space-y-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-[6px] w-full" />
          <SkeletonBlock className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
