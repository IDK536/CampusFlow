import { useState } from 'react'
import { GRID_STARTS, toTime } from '../../data/timeGrid'
import { bookingsCount } from '../../data/plural'

/** Круглый верх оси чуть выше максимума — чтобы подписи были ровными, а столбики не сжимались. */
const niceMax = (value: number) => {
  if (value <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(value))
  return [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((m) => m * power >= value)! * power
}

/** Сколько броней приходится на каждые полчаса — видно пиковые часы. */
export const HourBars = ({ values }: { values: number[] }) => {
  const [hover, setHover] = useState<number | null>(null)
  const max = niceMax(Math.max(...values))
  const peak = Math.max(...values)
  const peakIndex = values.indexOf(peak)
  const ticks = [max, max / 2, 0]
  const active = hover ?? null

  return (
    <div className="hour-bars">
      <div className="hour-bars__chart">
        <div className="hour-bars__y" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t}>{Math.round(t)}</span>
          ))}
        </div>
        <div className="hour-bars__plot" onMouseLeave={() => setHover(null)}>
          <div className="hour-bars__grid" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} />
            ))}
          </div>
          {values.map((v, i) => {
            const start = GRID_STARTS[i]
            const isPeak = i === peakIndex && v > 0
            return (
              <div
                key={start}
                className={`hour-bars__col${active === i ? ' is-hover' : ''}`}
                onMouseEnter={() => setHover(i)}
                aria-label={`${toTime(start)}–${toTime(start + 30)}: ${bookingsCount(v)}`}
                role="img"
              >
                <span
                  className={`hour-bars__bar${isPeak ? ' is-peak' : ''}`}
                  style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 18}ms` }}
                >
                  {isPeak && active === null && <span className="hour-bars__peak-label">{v}</span>}
                </span>
                {active === i && (
                  <span className="hour-bars__tip" style={{ bottom: `calc(${(v / max) * 100}% + 8px)` }}>
                    <strong>{bookingsCount(v)}</strong>
                    {toTime(start)}–{toTime(start + 30)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="hour-bars__axis" aria-hidden="true">
        {GRID_STARTS.filter((s) => (s - GRID_STARTS[0]) % 120 === 0).map((s) => (
          <span key={s} style={{ left: `${((s - GRID_STARTS[0]) / (GRID_STARTS.length * 30)) * 100}%` }}>
            {toTime(s)}
          </span>
        ))}
      </div>
    </div>
  )
}
