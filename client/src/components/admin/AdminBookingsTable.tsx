import type { Booking } from '../../api/types'
import { formatDateShort, formatWeekday, relativeDayLabel } from '../../data/timeGrid'
import { isPastBooking } from '../../data/availability'

interface AdminBookingsTableProps {
  bookings: Booking[]
  cancellingIds: number[]
  onCancel: (booking: Booking) => void
  cards?: boolean
}

export const AdminBookingsTable = ({ bookings, cancellingIds, onCancel, cards = false }: AdminBookingsTableProps) => (
  <div className={`data-table-wrap${cards ? ' is-cards' : ''}`}>
    <table className="data-table data-table--bookings">
      <thead>
        <tr>
          <th>№</th>
          <th>Аудитория</th>
          <th>Дата</th>
          <th>Время</th>
          <th>Кто</th>
          <th>Комментарий</th>
          <th>Статус</th>
          <th aria-label="Действия" />
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => {
          const cancelled = b.status === 'cancelled'
          const past = isPastBooking(b)
          return (
            <tr key={b.id} className={cancelled ? 'is-muted' : undefined}>
              <td data-label="№" className="data-table__id">
                {b.id}
              </td>
              <td data-label="Аудитория" className="data-table__strong">
                {b.roomName}
              </td>
              <td data-label="Дата">
                {relativeDayLabel(b.date) ?? formatDateShort(b.date)}
                <span className="data-table__sub">
                  {formatWeekday(b.date)}, {b.date}
                </span>
              </td>
              <td data-label="Время" className="data-table__mono">
                {b.startTime}–{b.endTime}
              </td>
              <td data-label="Кто">{b.userDisplayName}</td>
              <td data-label="Комментарий" className="data-table__comment">
                {b.comment || '—'}
              </td>
              <td data-label="Статус">
                <span className={`status-pill status-pill--${cancelled ? 'cancelled' : past ? 'past' : 'active'}`}>
                  {cancelled ? 'Отменена' : past ? 'Прошла' : 'Активна'}
                </span>
              </td>
              <td className="data-table__actions">
                {!cancelled && !past && (
                  <button
                    type="button"
                    className="button button--danger-ghost button--sm"
                    disabled={cancellingIds.includes(b.id)}
                    onClick={() => onCancel(b)}
                  >
                    {cancellingIds.includes(b.id) ? 'Отменяем…' : 'Отменить'}
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
