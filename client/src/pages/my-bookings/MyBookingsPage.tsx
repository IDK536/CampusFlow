import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Booking, BookingStatus } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { cancelRequested, myBookingsRequested, statusFilterChanged } from '../../redux/slices/bookingsSlice'
import { dayLabel } from '../../data/timeGrid'
import { BookingList } from '../../components/bookings/BookingList'
import { Segmented } from '../../components/ui/Segmented'
import { Skeleton } from '../../components/ui/Loader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { BookingDetails } from '../../components/bookings/BookingDetails'
import { catalogRequested } from '../../redux/slices/roomsSlice'

export const MyBookingsPage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { items, status, statusFilter, cancellingIds, justCancelledIds } = useAppSelector((s) => s.bookings)
  const [toCancel, setToCancel] = useState<Booking | null>(null)
  const [openedId, setOpenedId] = useState<number | null>(null)
  const catalog = useAppSelector((s) => s.rooms.catalog)
  // Берём бронь из списка, чтобы после отмены карточка сразу показала новый статус.
  const opened = items.find((b) => b.id === openedId) ?? null

  useEffect(() => {
    dispatch(myBookingsRequested())
    dispatch(catalogRequested())
  }, [dispatch])


  const confirmCancel = () => {
    if (!toCancel) return
    dispatch(cancelRequested(toCancel.id))
    setToCancel(null)
  }

  return (
    <div className="my-bookings-page">
      <div className="container container--narrow">
        <div className="page-head">
          <div>
            <h1 className="page-head__title">Мои брони</h1>
          </div>
          <Segmented<BookingStatus | ''>
            label="Статус"
            value={statusFilter}
            onChange={(v) => dispatch(statusFilterChanged(v))}
            options={[
              { value: '', label: 'Все' },
              { value: 'active', label: 'Активные' },
              { value: 'cancelled', label: 'Отменённые' },
            ]}
          />
        </div>

        {status === 'loading' && items.length === 0 ? (
          <Skeleton rows={3} height={96} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="ticket"
            title={statusFilter === 'cancelled' ? 'Отменённых броней нет' : 'Броней пока нет'}
            action={
              user?.role === 'student' ? (
                <Link to="/" className="button button--primary">
                  Найти аудиторию
                </Link>
              ) : undefined
            }
          >
            {user?.role === 'student'
              ? 'Выберите аудиторию и время на главном экране — бронь появится здесь.'
              : 'Администратор не создаёт новые брони, здесь видны только записи из seed-данных.'}
          </EmptyState>
        ) : (
          <BookingList
            bookings={items}
            cancellingIds={cancellingIds}
            justCancelledIds={justCancelledIds}
            onCancel={setToCancel}
            onOpen={(b) => setOpenedId(b.id)}
          />
        )}

      <BookingDetails
        booking={toCancel ? null : opened}
        room={catalog.find((r) => r.id === opened?.roomId)}
        cancelling={opened ? cancellingIds.includes(opened.id) : false}
        onCancel={user?.role === 'student' || user?.role === 'admin' ? setToCancel : undefined}
        onClose={() => setOpenedId(null)}
      />
      </div>

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Отменить бронь?"
        confirmLabel="Отменить бронь"
        cancelLabel="Оставить"
        danger
        onConfirm={confirmCancel}
        onClose={() => setToCancel(null)}
      >
        {toCancel && (
          <p>
            {toCancel.roomName}, {dayLabel(toCancel.date).toLowerCase()}, {toCancel.startTime}–{toCancel.endTime}.
            Время освободится, и его сможет забронировать кто-то другой.
          </p>
        )}
      </ConfirmDialog>
    </div>
  )
}
