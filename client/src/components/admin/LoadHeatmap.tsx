import type { CSSProperties } from 'react'
import { formatPercent, type LoadReport } from '../../data/stats'
import { BUILDINGS } from '../../data/equipment'
import { durationLabel, formatWeekday, parseISODate, relativeDayLabel, todayISO } from '../../data/timeGrid'
import { bookingsCount } from '../../data/plural'

interface LoadHeatmapProps {
  report: LoadReport
  dates: string[]
  onDayClick: (date: string) => void
}

/**
 * Яркость ячейки — от 0% до максимума за период (подписан в легенде): так видна разница
 * даже когда загрузка ровная. Пустая ячейка остаётся фоном.
 */
const intensity = (percent: number, max: number) => (percent === 0 || max === 0 ? 0 : 12 + Math.round((percent / max) * 63))

export const LoadHeatmap = ({ report, dates, onDayClick }: LoadHeatmapProps) => {
  const today = todayISO()
  const max = Math.max(0, ...report.cells.map((c) => c.percent))
  // Корпуса без единой брони за неделю не рисуем строкой из прочерков — перечисляем под таблицей.
  const busy = BUILDINGS.filter((b) => report.byBuilding[b].minutes > 0)
  const idle = BUILDINGS.filter((b) => report.byBuilding[b].minutes === 0)
  return (
    <div className="heatmap">
      <div className="heatmap__scroll">
        <table className="heatmap__table">
          <thead>
            <tr>
              <th scope="col" className="heatmap__corner">
                Корпус
              </th>
              {dates.map((date) => (
                <th key={date} scope="col" className={date === today ? 'is-today' : undefined}>
                  <button type="button" className="heatmap__day" onClick={() => onDayClick(date)} title="Открыть брони за день">
                    <span>{relativeDayLabel(date, today) === 'Сегодня' ? 'сегодня' : formatWeekday(date)}</span>
                    <strong>{parseISODate(date).getDate()}</strong>
                  </button>
                </th>
              ))}
              <th scope="col" className="heatmap__total-head">
                Итого
              </th>
            </tr>
          </thead>
          <tbody>
            {busy.map((building) => (
              <tr key={building}>
                <th scope="row" className="heatmap__building">
                  <span className="heatmap__letter">{building}</span>
                  <span className="heatmap__rooms">{report.byBuilding[building].rooms} ауд.</span>
                </th>
                {dates.map((date) => {
                  const cell = report.cells.find((c) => c.building === building && c.date === date)!
                  const heat = intensity(cell.percent, max)
                  return (
                    <td key={date}>
                      <span
                        className={`heatmap__cell${heat === 0 ? ' heatmap__cell--0' : ''}${heat >= 55 ? ' is-strong' : ''}`}
                        style={heat ? ({ '--heat': `${heat}%` } as CSSProperties) : undefined}
                        title={`Корпус ${building}, ${date}: ${bookingsCount(cell.bookings)}, ${durationLabel(cell.minutes || 0)} из ${durationLabel(cell.capacityMinutes)}`}
                      >
                        {cell.minutes > 0 ? formatPercent(cell.percent) : '—'}
                        {cell.bookings > 0 && <small>{bookingsCount(cell.bookings)}</small>}
                      </span>
                    </td>
                  )
                })}
                <td className="heatmap__total">{formatPercent(report.byBuilding[building].percent)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">По дню</th>
              {dates.map((date) => (
                <td key={date} className="heatmap__total">
                  {formatPercent(report.byDay[date].percent)}
                </td>
              ))}
              <td className="heatmap__total heatmap__total--all">{formatPercent(report.averagePercent)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {busy.length === 0 && <p className="heatmap__empty">За эту неделю броней нет.</p>}
      <div className="heatmap__legend">
        <span aria-hidden="true">0%</span>
        <span className="heatmap__gradient" aria-hidden="true" />
        <span aria-hidden="true">{formatPercent(max)} — максимум за неделю</span>
        {idle.length > 0 && busy.length > 0 && (
          <span className="heatmap__legend-note">
            Без броней: {idle.length === BUILDINGS.length ? 'все корпуса' : `корпус${idle.length > 1 ? 'а' : ''} ${idle.join(', ')}`}
          </span>
        )}
      </div>
    </div>
  )
}
