import type { TimeInterval } from '../../api/types'
import { invertSlots } from '../../api/bookingRules'
import { DAY_END, DAY_START, toMinutes } from '../../data/timeGrid'

const SPAN = DAY_END - DAY_START
const pos = (t: string) => ((toMinutes(t) - DAY_START) / SPAN) * 100

/** Узкая полоска дня 09–18: занятые отрезки закрашены, выделенный интервал обведён. */
export const DayBar = ({ freeSlots, highlight }: { freeSlots: TimeInterval[]; highlight?: TimeInterval | null }) => {
  const busy = invertSlots(freeSlots)
  return (
    <div className="day-bar" aria-hidden="true">
      {busy.map((b) => (
        <span
          key={b.startTime}
          className="day-bar__busy"
          style={{ left: `${pos(b.startTime)}%`, width: `${pos(b.endTime) - pos(b.startTime)}%` }}
        />
      ))}
      {highlight && (
        <span
          className="day-bar__highlight"
          style={{ left: `${pos(highlight.startTime)}%`, width: `${pos(highlight.endTime) - pos(highlight.startTime)}%` }}
        />
      )}
    </div>
  )
}
