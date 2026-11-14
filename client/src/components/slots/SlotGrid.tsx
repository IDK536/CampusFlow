import { useState } from 'react'
import type { TimeInterval } from '../../api/types'
import { overlaps } from '../../api/bookingRules'
import { DAY_END, DAY_START, GRID_STARTS, STEP, nowMinutes, toMinutes, toTime, todayISO } from '../../data/timeGrid'

interface SlotGridProps {
  date: string
  freeSlots: TimeInterval[]
  selection: TimeInterval | null
  conflict: TimeInterval | null
  conflictTick: number
  readOnly: boolean
  onSelect: (interval: TimeInterval | null) => void
  onBlocked: (reason: 'busy' | 'past') => void
}

const isFreeCell = (free: TimeInterval[], start: number) =>
  free.some((f) => toMinutes(f.startTime) <= start && start + STEP <= toMinutes(f.endTime))

/**
 * Таймлайн дня: 18 ячеек по 30 минут. Первый клик ставит начало, второй — конец (в любую сторону).
 * Если между ними есть занятое время, интервал не выбирается и сетка «вздрагивает».
 */
export const SlotGrid = ({ date, freeSlots, selection, conflict, conflictTick, readOnly, onSelect, onBlocked }: SlotGridProps) => {
  const [anchorState, setAnchor] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const pastLimit = date === todayISO() ? nowMinutes() : -1
  // Якорь «первого клика» живёт, только пока выбрана ровно эта одна ячейка:
  // если выбор сбросили или поменяли снаружи (бронь создана, выбран слот из списка), якорь забывается.
  const anchor =
    anchorState !== null &&
    selection &&
    toMinutes(selection.startTime) === anchorState &&
    toMinutes(selection.endTime) === anchorState + STEP
      ? anchorState
      : null

  const cellState = (start: number) => {
    if (start < pastLimit) return 'past'
    return isFreeCell(freeSlots, start) ? 'free' : 'busy'
  }

  const rangeIsFree = (from: number, to: number) => {
    for (let t = from; t < to; t += STEP) if (cellState(t) !== 'free') return false
    return true
  }

  const preview: TimeInterval | null =
    anchor !== null && hover !== null && !readOnly
      ? { startTime: toTime(Math.min(anchor, hover)), endTime: toTime(Math.max(anchor, hover) + STEP) }
      : null
  const shown = preview ?? selection

  const click = (start: number) => {
    if (readOnly) return
    const state = cellState(start)
    if (state !== 'free') {
      setShakeKey((k) => k + 1)
      onBlocked(state)
      return
    }
    if (anchor === null) {
      setAnchor(start)
      onSelect({ startTime: toTime(start), endTime: toTime(start + STEP) })
      return
    }
    const from = Math.min(anchor, start)
    const to = Math.max(anchor, start) + STEP
    setAnchor(null)
    if (!rangeIsFree(from, to)) {
      setShakeKey((k) => k + 1)
      onBlocked('busy')
      onSelect({ startTime: toTime(start), endTime: toTime(start + STEP) })
      return
    }
    onSelect({ startTime: toTime(from), endTime: toTime(to) })
  }

  const inside = (start: number, interval: TimeInterval | null) =>
    !!interval && overlaps(interval, { startTime: toTime(start), endTime: toTime(start + STEP) })

  const nowOffset =
    pastLimit > DAY_START && pastLimit < DAY_END ? ((pastLimit - DAY_START) / (DAY_END - DAY_START)) * 100 : null

  return (
    <div className="slot-grid">
      {nowOffset !== null && (
        <span className="slot-grid__now" style={{ left: `${nowOffset}%` }} aria-hidden="true">
          сейчас {toTime(pastLimit)}
        </span>
      )}
      <div
        key={`${shakeKey}-${conflictTick}`}
        className={`slot-grid__track${shakeKey || conflictTick ? ' is-shaking' : ''}`}
        onMouseLeave={() => setHover(null)}
        role="group"
        aria-label="Время с 09:00 до 18:00, шаг 30 минут"
      >
        {GRID_STARTS.map((start) => {
          const state = cellState(start)
          const selected = inside(start, shown)
          const isConflict = inside(start, conflict)
          const classes = [
            'slot-grid__cell',
            `slot-grid__cell--${state}`,
            selected && 'is-selected',
            selected && toMinutes(shown!.startTime) === start && 'is-first',
            selected && toMinutes(shown!.endTime) === start + STEP && 'is-last',
            isConflict && 'is-conflict',
            start % 60 === 0 && 'is-hour',
            anchor === start && 'is-anchor',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={start}
              type="button"
              className={classes}
              onClick={() => click(start)}
              onMouseEnter={() => setHover(start)}
              onFocus={() => setHover(start)}
              disabled={readOnly && state !== 'free'}
              aria-pressed={selected}
              aria-label={`${toTime(start)}–${toTime(start + STEP)}: ${
                state === 'free' ? 'свободно' : state === 'busy' ? 'занято' : 'уже прошло'
              }`}
            >
              <span className="slot-grid__time">{toTime(start)}</span>
            </button>
          )
        })}
        {nowOffset !== null && <span className="slot-grid__now-line" style={{ left: `${nowOffset}%` }} aria-hidden="true" />}
      </div>
      <div className="slot-grid__scale" aria-hidden="true">
        {[...GRID_STARTS.filter((s) => s % 60 === 0), DAY_END].map((s) => (
          <span key={s} style={{ left: `${((s - DAY_START) / (DAY_END - DAY_START)) * 100}%` }}>
            {s / 60}
          </span>
        ))}
      </div>
      {anchor !== null && !readOnly && <p className="slot-grid__hint">Теперь выберите, до какого времени</p>}
    </div>
  )
}
