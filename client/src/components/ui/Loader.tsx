export const Loader = ({ label = 'Загружаем…' }: { label?: string }) => (
  <div className="loader" role="status">
    <span className="loader__blocks" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
    <span className="loader__label">{label}</span>
  </div>
)

export const Skeleton = ({ rows = 3, height = 72 }: { rows?: number; height?: number }) => (
  <div className="skeleton-list" aria-hidden="true">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="skeleton" style={{ height }} />
    ))}
  </div>
)
