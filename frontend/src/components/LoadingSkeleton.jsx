export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 animate-pulse rounded-xl border border-cyan-300/15 bg-[rgba(20,25,45,0.65)]" />
      ))}
    </div>
  )
}
