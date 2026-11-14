import { Link } from 'react-router-dom'
import type { Booking } from '../../api/types'
import {
  durationLabel,
  formatMonth,
  formatWeekday,
  intervalMinutes,
  parseISODate,
  relativeDayLabel,
} from '../../data/timeGrid'
import { Icon } from '../icons/Icon'

interface BookingCardProps {
  booking: Booking
  past: boolean
  cancelling: boolean
  justCancelled: boolean
  onCancel?: (booking: Booking) => void
  onOpen?: (booking: Booking) => void
}

export const BookingCard = ({ booking, past, cancelling, justCancelled, onCancel, onOpen }: BookingCardProps) => {
  const cancelled = booking.status === 'cancelled'
  const relative = relativeDayLabel(booking.date)
  return (
    <article
      className={`booking-card${cancelled ? ' is-cancelled' : ''}${past ? ' is-past' : ''}${justCancelled ? ' is-just-cancelled' : ''}${onOpen ? ' is-clickable' : ''}`}
      // Вся карточка открывает подробности; кнопки внутри работают сами по себе.
      onClick={(e) => {
        if (onOpen && !(e.target as HTMLElement).closest('a, button')) onOpen(booking)
      }}
      onKeyDown={(e) => {
        if (onOpen && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onOpen(booking)
        }
      }}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Бронь ${booking.roomName}, ${booking.date}, ${booking.startTime}–${booking.endTime}` : undefined}
    >
      <div className="booking-card__date" aria-label={booking.date}>
        <span className="booking-card__weekday">{relative ?? formatWeekday(booking.date)}</span>
        <span className="booking-card__day">{parseISODate(booking.date).getDate()}</span>
        <span className="booking-card__month">{formatMonth(booking.date)}</span>
      </div>

      <div className="booking-card__body">
        <div className="booking-card__line">
          <span className="booking-card__room">{booking.roomName}</span>
          <span className={`status-pill status-pill--${cancelled ? 'cancelled' : past ? 'past' : 'active'}`}>
            {cancelled ? 'Отменена' : past ? 'Прошла' : 'Активна'}
          </span>
        </div>
        <p className="booking-card__time">
          <Icon name="clock" size={16} />
          {booking.startTime}–{booking.endTime}
          <span className="booking-card__duration">{durationLabel(intervalMinutes(booking.startTime, booking.endTime))}</span>
        </p>
        {booking.comment && <p className="booking-card__comment">{booking.comment}</p>}
      </div>

      <div className="booking-card__actions">
        {!cancelled && !past && (
          <Link className="button button--ghost button--sm" to={`/?room=${booking.roomId}&date=${booking.date}`}>
            Расписание
          </Link>
        )}
        {!cancelled && !past && onCancel && (
          <button
            type="button"
            className="button button--danger-ghost button--sm"
            onClick={() => onCancel(booking)}
            disabled={cancelling}
          >
            {cancelling ? 'Отменяем…' : 'Отменить'}
          </button>
        )}
      </div>
    </article>
  )
}
