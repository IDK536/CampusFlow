import { useMemo, useState, type FormEvent } from 'react'
import type { Building, Equipment } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { recommendRequested } from '../../redux/slices/roomsSlice'
import type { RecommendParams, Recommendation } from '../../data/recommend'
import { EQUIPMENT } from '../../data/equipment'
import { BuildingSelect } from '../ui/BuildingSelect'
import { durationLabel, toMinutes } from '../../data/timeGrid'
import { TimePicker } from '../ui/TimePicker'
import { Skeleton } from '../ui/Loader'
import { EmptyState } from '../ui/EmptyState'
import { DayBar } from './DayBar'
import { seats } from '../../data/plural'

interface RecommendBlockProps {
  onChoose: (recommendation: Recommendation) => void
  canBook: boolean
}

export const RecommendBlock = ({ onChoose, canBook }: RecommendBlockProps) => {
  const dispatch = useAppDispatch()
  const { recommendParams, recommendations, recommendStatus, catalog } = useAppSelector((s) => s.rooms)
  const date = useAppSelector((s) => s.rooms.filters.date)
  const [params, setParams] = useState<RecommendParams>(recommendParams)
  const [submittedFor, setSubmittedFor] = useState<string | null>(null)
  const set = (patch: Partial<RecommendParams>) => setParams((p) => ({ ...p, ...patch }))

  // Этажи из справочника; если выбран корпус — только его этажи.
  const floors = useMemo(
    () =>
      [...new Set(catalog.filter((r) => !params.building || r.building === params.building).map((r) => r.floor))].sort(
        (a, b) => a - b,
      ),
    [catalog, params.building],
  )
  const floor = params.floor ?? null

  const timeMode = params.timeMode ?? 'exact'
  const durationMin = params.durationMin ?? 60
  const windowLength = toMinutes(params.windowEnd) - toMinutes(params.windowStart)
  const windowTooShort = windowLength <= 0 || (timeMode === 'flexible' && windowLength < durationMin)
  const invalid = !params.people || params.people < 1 || windowTooShort

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (invalid) return
    setSubmittedFor(date)
    dispatch(recommendRequested({ ...params, timeMode, durationMin }))
  }

  const toggleEquipment = (key: Equipment) =>
    set({
      equipment: params.equipment.includes(key) ? params.equipment.filter((x) => x !== key) : [...params.equipment, key],
    })

  const showResults = recommendStatus !== 'idle' && submittedFor !== null

  return (
    <div className="recommend">
      <form className="recommend__form" onSubmit={submit}>
        <div className="recommend__intro">
          <h2 className="recommend__title">Подобрать аудиторию</h2>
        </div>

        <div className="recommend__fields">
          <label className="field field--people">
            <span className="field__label">Сколько человек</span>
            <input
              className="input"
              type="number"
              min={1}
              max={500}
              value={params.people || ''}
              onChange={(e) => set({ people: Number.parseInt(e.target.value, 10) || 0 })}
            />
          </label>

          <div className="field field--time">
            <TimePicker
              value={{ mode: timeMode, start: params.windowStart, end: params.windowEnd, durationMin }}
              onChange={(v) =>
                set({ timeMode: v.mode === 'any' ? 'exact' : v.mode, windowStart: v.start, windowEnd: v.end, durationMin: v.durationMin })
              }
            />
          </div>

          <div className="recommend__pair">
          <div className="field">
            <span className="field__label">Предпочтительный корпус</span>
            <BuildingSelect<Building | ''>
              value={params.building}
              onChange={(building) => {
                // В другом корпусе выбранного этажа может не быть — тогда сбрасываем на «любой».
                const has = catalog.some((r) => (!building || r.building === building) && r.floor === floor)
                set({ building, floor: has ? floor : null })
              }}
              anyLabel="Любой"
            />
          </div>

          <div className="field">
            <span className="field__label">Предпочтительный этаж</span>
            <select
              className="select select--floor"
              value={floor ?? ''}
              onChange={(e) => set({ floor: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">Любой</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f} этаж
                </option>
              ))}
            </select>
          </div>
          </div>

          <div className="field field--wide">
            <span className="field__label">Обязательно нужно</span>
            <div className="chip-row">
              {EQUIPMENT.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  className={`chip${params.equipment.includes(e.key) ? ' is-active' : ''}`}
                  aria-pressed={params.equipment.includes(e.key)}
                  onClick={() => toggleEquipment(e.key)}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {windowTooShort && <p className="form-hint form-hint--warn">{timeMode === 'flexible' && windowLength > 0 ? `Промежуток короче, чем ${durationLabel(durationMin)}.` : 'Время окончания должно быть позже начала.'}</p>}
        <button type="submit" className="button button--primary" disabled={invalid || recommendStatus === 'loading'}>
          {recommendStatus === 'loading' ? 'Подбираем…' : 'Подобрать'}
        </button>
      </form>

      {showResults && recommendStatus === 'loading' && <Skeleton rows={3} height={150} />}

      {showResults && recommendStatus === 'succeeded' && recommendations.length === 0 && (
        <EmptyState icon="target" title="Ничего не нашлось">
          Попробуйте другое время, меньше людей или другой день.
        </EmptyState>
      )}

      {showResults && recommendStatus === 'succeeded' && recommendations.length > 0 && (
        <>
        {timeMode === 'exact' && !recommendations.some((r) => r.full) && (
          <p className="form-hint form-hint--warn">
            Целиком на {params.windowStart}–{params.windowEnd} свободной аудитории нет — вот самые удобные варианты.
          </p>
        )}
        <ol className="recommend__results">
          {recommendations.map((rec, index) => (
            <li key={rec.room.id} className={`recommendation recommendation--${index + 1}`}>
              <span className="recommendation__rank">{index + 1}</span>
              <div className="recommendation__body">
                <div className="recommendation__head">
                  <div>
                    <p className="recommendation__name">{rec.room.name}</p>
                    <p className="recommendation__meta">
                      Корпус {rec.room.building} · {rec.room.floor} этаж · {seats(rec.room.capacity)}
                    </p>
                  </div>
                  <div className={`recommendation__time${rec.full ? '' : ' recommendation__time--partial'}`}>
                    {rec.interval.startTime}–{rec.interval.endTime}
                  </div>
                </div>
                <DayBar freeSlots={rec.room.freeSlots} highlight={rec.interval} />
                <ul className="recommendation__reasons">
                  {rec.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <div className="recommendation__foot">
                  <button type="button" className="button button--secondary button--sm" onClick={() => onChoose(rec)}>
                    {canBook ? 'Взять этот вариант' : 'Открыть расписание'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
        </>
      )}
    </div>
  )
}
