import { Link } from 'react-router-dom'
import type { Booking, Room } from '../../api/types'
import { isPastBooking } from '../../data/availability'
import { dayLabel, durationLabel, formatDateLong, intervalMinutes } from '../../data/timeGrid'
import { seats } from '../../data/plural'
import { Modal } from '../ui/Modal'
import { Icon } from '../icons/Icon'

interface BookingDetailsProps {
  booking: Booking | null
  room?: Room
  cancelling: boolean
  onCancel?: (booking: Booking) => void
  onClose: () => void
}

/** Карточка брони из «Моих броней»: всё о брони в виде билета, полный комментарий и действия. */
export const BookingDetails = ({ booking, room, cancelling, onCancel, onClose }: BookingDetailsProps) => {
  const cancelled = booking?.status === 'cancelled'
  const past = booking ? isPastBooking(booking) : false
  const active = Boolean(booking) && !cancelled && !past
  const statusLabel = cancelled ? 'Отменена' : past ? 'Прошла' : 'Активна'

  return (
    <Modal open={Boolean(booking)} onClose={onClose} title={`Бронь ${booking?.roomName ?? ''}`} bare size="sm">
      {booking && (
        <div className={`ticket${active ? '' : ' ticket--muted'}`}>
          <div className="ticket__stub">
            <span className="ticket__check">
              <Icon name={cancelled ? 'close' : active ? 'check' : 'clock'} size={22} />
            </span>
            <span className="ticket__stub-label">Бронь</span>
            <span className="ticket__stub-id">№ {booking.id}</span>
          </div>
          <div className="ticket__main">
            <div className="ticket__top">
              <span className={`status-pill status-pill--${cancelled ? 'cancelled' : past ? 'past' : 'active'}`}>{statusLabel}</span>
              <button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть">
                <Icon name="close" />
              </button>
            </div>
            <p className="ticket__room">{booking.roomName}</p>
            {room && (
              <p className="ticket__where">
                Корпус {room.building}, {room.floor} этаж · {seats(room.capacity)}
              </p>
            )}
            <dl className="ticket__facts">
              <div>
                <dt>Когда</dt>
                <dd>
                  {dayLabel(booking.date)}
                  {dayLabel(booking.date) !== formatDateLong(booking.date) && (
                    <span className="ticket__sub">{formatDateLong(booking.date)}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Время</dt>
                <dd>
                  {booking.startTime}–{booking.endTime}
                  <span className="ticket__sub">{durationLabel(intervalMinutes(booking.startTime, booking.endTime))}</span>
                </dd>
              </div>
            </dl>
            {booking.comment ? (
              <p className="ticket__comment">«{booking.comment}»</p>
            ) : (
              <p className="ticket__comment ticket__comment--empty">Без комментария</p>
            )}
            <div className="ticket__actions">
              {active && onCancel && (
                <button
                  type="button"
                  className="button button--danger-ghost"
                  disabled={cancelling}
                  onClick={() => onCancel(booking)}
                >
                  {cancelling ? 'Отменяем…' : 'Отменить'}
                </button>
              )}
              {active && (
                <Link className="button button--ghost" to={`/?room=${booking.roomId}&date=${booking.date}`} onClick={onClose}>
                  Расписание
                </Link>
              )}
              <button type="button" className="button button--primary" onClick={onClose}>
                Готово
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
