import type { Booking } from '../../api/types'
import { isPastBooking } from '../../data/availability'
import { BookingCard } from './BookingCard'

const byTime = (a: Booking, b: Booking) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)

interface BookingListProps {
  bookings: Booking[]
  cancellingIds: number[]
  justCancelledIds: number[]
  onCancel: (booking: Booking) => void
  onOpen: (booking: Booking) => void
}

/** Три группы: предстоящие (по возрастанию), прошедшие и отменённые (свежие сверху). */
export const BookingList = ({ bookings, cancellingIds, justCancelledIds, onCancel, onOpen }: BookingListProps) => {
  const upcoming = bookings.filter((b) => b.status === 'active' && !isPastBooking(b)).sort(byTime)
  const past = bookings.filter((b) => b.status === 'active' && isPastBooking(b)).sort(byTime).reverse()
  const cancelled = bookings.filter((b) => b.status === 'cancelled').sort(byTime).reverse()

  const groups = [
    { key: 'upcoming', title: 'Предстоящие', items: upcoming },
    { key: 'cancelled', title: 'Отменённые', items: cancelled },
    { key: 'past', title: 'Прошедшие', items: past },
  ].filter((g) => g.items.length)

  return (
    <div className="booking-list">
      {groups.map((group) => (
        <section key={group.key} className="booking-list__group">
          <h2 className="booking-list__title">
            {group.title}
            <span className="booking-list__count">{group.items.length}</span>
          </h2>
          <div className="booking-list__items">
            {group.items.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                past={isPastBooking(b)}
                cancelling={cancellingIds.includes(b.id)}
                justCancelled={justCancelledIds.includes(b.id)}
                onCancel={onCancel}
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
