import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Building, Room } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { catalogRequested } from '../../redux/slices/roomsSlice'
import { adminFiltersChanged, roomDeleteRequested, statsRequested } from '../../redux/slices/adminSlice'
import { BuildingSelect } from '../../components/ui/BuildingSelect'
import { plural, roomsCount } from '../../data/plural'
import { todayISO } from '../../data/timeGrid'
import { AdminRoomsTable } from '../../components/admin/AdminRoomsTable'
import { RoomFormModal } from '../../components/admin/RoomFormModal'
import { Skeleton } from '../../components/ui/Loader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Icon } from '../../components/icons/Icon'

export const AdminRoomsPage = () => {
  const dispatch = useAppDispatch()
  const { catalog, catalogStatus } = useAppSelector((s) => s.rooms)
  const deletingId = useAppSelector((s) => s.admin.deletingRoomId)
  const activeBookings = useAppSelector((s) => s.admin.stats.bookings)
  const [building, setBuilding] = useState<Building | ''>('')
  const [editing, setEditing] = useState<Room | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Room | null>(null)

  useEffect(() => {
    dispatch(catalogRequested())
    dispatch(statsRequested())
  }, [dispatch])

  // Сколько впереди активных броней в каждой аудитории — подсказка перед удалением.
  // Удаление запрещает любая связанная бронь, но отменённые и прошедшие здесь не загружаются.
  const activeByRoom = useMemo(() => {
    const today = todayISO()
    const map = new Map<number, number>()
    activeBookings
      .filter((b) => b.status === 'active' && b.date >= today)
      .forEach((b) => map.set(b.roomId, (map.get(b.roomId) ?? 0) + 1))
    return map
  }, [activeBookings])

  const rooms = useMemo(
    () =>
      catalog
        .filter((r) => !building || r.building === building)
        .sort((a, b) => a.building.localeCompare(b.building) || a.floor - b.floor || a.name.localeCompare(b.name)),
    [catalog, building],
  )
  const totalSeats = rooms.reduce((s, r) => s + r.capacity, 0)

  const closeForm = useCallback(() => setFormOpen(false), [])
  const openForm = (room: Room | null) => {
    setEditing(room)
    setFormOpen(true)
  }

  const deleteBlocked = toDelete ? (activeByRoom.get(toDelete.id) ?? 0) : 0

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-head__title">Справочник аудиторий</h1>
            <p className="page-head__lead">{roomsCount(catalog.length)}</p>
          </div>
          <button type="button" className="button button--primary" onClick={() => openForm(null)}>
            <Icon name="plus" />
            Добавить аудиторию
          </button>
        </div>

        <section className="toolbar">
          <div className="toolbar__group">
            <span className="toolbar__label">Корпус</span>
            <BuildingSelect<Building | ''> value={building} onChange={setBuilding} anyLabel="Все корпуса" small />
          </div>
          <p className="toolbar__summary">
            Показано {rooms.length} · {totalSeats} мест
          </p>
        </section>

        {catalogStatus === 'loading' && catalog.length === 0 ? (
          <Skeleton rows={6} height={52} />
        ) : rooms.length === 0 ? (
          <EmptyState icon="building" title="Аудиторий нет" action={
            <button type="button" className="button button--primary" onClick={() => openForm(null)}>
              Добавить первую
            </button>
          } />
        ) : (
          <AdminRoomsTable
            rooms={rooms}
            activeByRoom={activeByRoom}
            deletingId={deletingId}
            onEdit={openForm}
            onDelete={setToDelete}
          />
        )}
      </div>

      <RoomFormModal
        open={formOpen}
        room={editing}
        existingNames={catalog.map((r) => r.name)}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Удалить ${toDelete?.name ?? ''}?`}
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        danger
        onConfirm={() => {
          if (toDelete) dispatch(roomDeleteRequested(toDelete.id))
          setToDelete(null)
        }}
        onClose={() => setToDelete(null)}
      >
        {deleteBlocked > 0 ? (
          <p>
            В этой аудитории {plural(deleteBlocked, ['активная бронь', 'активные брони', 'активных броней'])}. Сервер не даст
            удалить аудиторию, с которой связана хотя бы одна бронь, — даже отменённая или прошедшая, поэтому отмена броней
            не поможет.{' '}
            <Link
              to="/admin/bookings"
              onClick={() => {
                dispatch(adminFiltersChanged({ roomId: toDelete!.id, status: '', dateFrom: '', dateTo: '', userId: '' }))
                setToDelete(null)
              }}
            >
              Посмотреть брони
            </Link>
          </p>
        ) : (
          <p>
            Аудитория исчезнет из поиска и со схемы кампуса. Действие нельзя отменить. Если с ней связаны брони (в том числе
            отменённые или прошедшие), сервер откажет в удалении.
          </p>
        )}
      </ConfirmDialog>
    </div>
  )
}
