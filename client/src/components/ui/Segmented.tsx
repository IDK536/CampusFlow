import type { ReactNode } from 'react'

export interface SegmentOption<T extends string> {
  value: T
  label: ReactNode
  title?: string
}

interface SegmentedProps<T extends string> {
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
  label: string
  size?: 'sm' | 'md'
}

/** Переключатель-радиогруппа: корпус, вид результатов, статус броней. */
export const Segmented = <T extends string>({ value, options, onChange, label, size = 'md' }: SegmentedProps<T>) => (
  <div className={`segmented segmented--${size}`} role="radiogroup" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={option.value === value}
        title={option.title}
        className={`segmented__item${option.value === value ? ' is-active' : ''}`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
)
