import type { Building } from '../../api/types'
import { BUILDINGS } from '../../data/equipment'

interface BuildingSelectProps<T extends Building | ''> {
  value: T
  onChange: (value: T) => void
  /** Подпись пункта «без корпуса» («Все», «Любой»). Не задана — пустого пункта нет. */
  anyLabel?: string
  id?: string
  small?: boolean
}

/** Выбор корпуса списком: корпусов 20, кнопками они не помещаются. */
export const BuildingSelect = <T extends Building | ''>({ value, onChange, anyLabel, id, small }: BuildingSelectProps<T>) => (
  <select
    id={id}
    className={`select select--building${small ? ' select--sm' : ''}`}
    value={value}
    aria-label="Корпус"
    onChange={(e) => onChange(e.target.value as T)}
  >
    {anyLabel !== undefined && <option value="">{anyLabel}</option>}
    {BUILDINGS.map((b) => (
      <option key={b} value={b}>
        Корпус {b}
      </option>
    ))}
  </select>
)
