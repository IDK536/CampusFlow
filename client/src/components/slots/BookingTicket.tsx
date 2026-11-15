import { useNavigate } from 'react-router-dom'
import type { Booking, Room } from '../../api/types'
import { useAppDispatch } from '../../redux/hooks'
import { ticketClosed } from '../../redux/slices/slotsSlice'
import { dayLabel, durationLabel, formatDateLong, intervalMinutes } from '../../data/timeGrid'
import { Modal } from '../ui/Modal'
import { seats } from '../../data/plural'
import { Icon } from '../icons/Icon'

/** Подтверждение брони в виде билета: всё, что нужно запомнить, на одной карточке. */
export const BookingTicket = ({ booking, room }: { booking: Booking | null; room?: Room }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const close = () => dispatch(ticketClosed())

  return (
    <Modal open={Boolean(booking)} onClose={close} title="Бронь создана" bare size="sm">
      {booking && (
        <div className="ticket">
          <div className="ticket__stub">
            <span className="ticket__check">
              <Icon name="check" size={22} />
            </span>
            <span className="ticket__stub-label">Бронь</span>
            <span className="ticket__stub-id">№ {booking.id}</span>
          </div>
          <div className="ticket__main">
            <p className="ticket__eyebrow">Аудитория забронирована</p>
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
            {booking.comment && <p className="ticket__comment">«{booking.comment}»</p>}
            <div className="ticket__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  close()
                  navigate('/my-bookings')
                }}
              >
                Мои брони
              </button>
              <button type="button" className="button button--primary" onClick={close}>
                Готово
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
