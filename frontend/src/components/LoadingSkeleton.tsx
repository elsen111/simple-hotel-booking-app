interface LoadingSkeletonProps {
  label: string;
  rows?: number;
}

export default function LoadingSkeleton({ label, rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className="animate-fade-in rounded-lg border border-sand-darker bg-white p-6 shadow-sm" role="status" aria-live="polite">
      <p className="mb-4 font-display text-sm font-medium text-ink-soft">{label}</p>

      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-md bg-sand-dark" style={{ animationDelay: `${index * 80}ms` }} />
        ))}
      </div>
    </div>
  );
}
