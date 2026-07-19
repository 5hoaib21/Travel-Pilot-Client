export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-xl border border-warm-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="h-40 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded-md" />
        <div className="flex gap-2">
          <div className="h-4 w-16 skeleton rounded-md" />
          <div className="h-4 w-20 skeleton rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-24 skeleton rounded-md" />
          <div className="h-4 w-28 skeleton rounded-md" />
        </div>
        <div className="h-4 w-full skeleton rounded-md" />
      </div>
    </div>
  )
}

export function TripCardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DayTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 skeleton rounded-full" />
            <div className="flex-1 w-0.5 skeleton my-2" />
          </div>
          <div className="flex-1 space-y-3 pb-6">
            <div className="h-5 w-32 skeleton rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="h-24 skeleton rounded-lg" />
              <div className="h-24 skeleton rounded-lg" />
              <div className="h-24 skeleton rounded-lg" />
            </div>
            <div className="h-20 skeleton rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ className = 'h-64' }) {
  return (
    <div className={`rounded-xl border border-warm-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 ${className}`}>
      <div className="h-5 w-40 skeleton rounded-md mb-4" />
      <div className="h-full min-h-[200px] skeleton rounded-lg" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="rounded-xl border border-warm-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="flex gap-4 p-4 border-b border-warm-200 dark:border-slate-700">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-4 skeleton rounded-md" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex gap-4 p-4 ${i < rows - 1 ? 'border-b border-warm-200 dark:border-slate-700' : ''}`}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 skeleton rounded-md" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 skeleton rounded-xl" />
      ))}
    </div>
  )
}
