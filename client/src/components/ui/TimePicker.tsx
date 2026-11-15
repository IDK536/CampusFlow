import { GRID_BOUNDS, durationLabel, toMinutes } from '../../data/timeGrid'
import { Segmented } from './Segmented'

/** any — время не важно (только в фильтрах), exact — ровно с … до …, flexible — N минут где-то в промежутке. */
export type TimePickerMode = 'any' | 'exact' | 'flexible'

const DURATIONS = [30, 60, 90, 120, 150, 180, 240]

export interface TimePickerValue {
  mode: TimePickerMode
  start: string
  end: string
  durationMin: number
}

interface TimePickerProps {
  value: TimePickerValue
  onChange: (value: TimePickerValue) => void
  /** Показывать ли режим «Любое» (в фильтрах время необязательно, в подборе — обязательно). */
  allowAny?: boolean
  label?: string
  /** Класс подписи — чтобы совпадала с соседними полями формы. */
  labelClassName?: string
}

const MODE_LABELS: Record<TimePickerMode, string> = {
  any: 'Любое',
  exact: 'Точное',
  flexible: 'В промежутке',
}

/**
 * Блок «Время»: сверху подпись и переключатель режима, под ним поля.
 * В режиме «в промежутке» — «на 1 ч · с 10:00 · до 16:00», в точном — «с · до».
 */
export const TimePicker = ({
  value,
  onChange,
  allowAny = false,
  label = 'Время',
  labelClassName = 'field__label',
}: TimePickerProps) => {
  const set = (patch: Partial<TimePickerValue>) => onChange({ ...value, ...patch })
  const modes: TimePickerMode[] = allowAny ? ['any', 'exact', 'flexible'] : ['exact', 'flexible']

  const setStart = (start: string) => {
    // Конец не может быть раньше начала: двигаем его, сохраняя хотя бы час (или длительность).
    const minLength = value.mode === 'flexible' ? value.durationMin : 60
    const end =
      toMinutes(value.end) - toMinutes(start) >= Math.min(minLength, 30)
        ? value.end
        : (GRID_BOUNDS.find((t) => toMinutes(t) >= toMinutes(start) + minLength) ?? GRID_BOUNDS[GRID_BOUNDS.length - 1])
    set({ start, end })
  }

  return (
    <div className="time-picker">
      <span className={labelClassName}>{label}</span>
      <div className="time-picker__row">
        <Segmented<TimePickerMode>
          label="Режим времени"
          value={value.mode}
          onChange={(mode) => set({ mode })}
          options={modes.map((m) => ({ value: m, label: MODE_LABELS[m] }))}
        />

        {value.mode !== 'any' && (
        <div className="time-picker__fields">
          {value.mode === 'flexible' && (
            <select
              className="select time-picker__duration"
              value={value.durationMin}
              onChange={(e) => set({ durationMin: Number(e.target.value) })}
              aria-label="Сколько нужно"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  на {durationLabel(d)}
                </option>
              ))}
            </select>
          )}
          <select className="select" value={value.start} onChange={(e) => setStart(e.target.value)} aria-label="С">
            {GRID_BOUNDS.slice(0, -1).map((t) => (
              <option key={t} value={t}>
                с {t}
              </option>
            ))}
          </select>
          <select className="select" value={value.end} onChange={(e) => set({ end: e.target.value })} aria-label="До">
            {GRID_BOUNDS.filter((t) => toMinutes(t) > toMinutes(value.start)).map((t) => (
              <option key={t} value={t}>
                до {t}
              </option>
            ))}
          </select>
        </div>
        )}
      </div>
    </div>
  )
}
