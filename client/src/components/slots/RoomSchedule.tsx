import type { Room } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectionChanged } from '../../redux/slices/slotsSlice'
import { pushToast } from '../../redux/slices/uiSlice'
import { roomSelected } from '../../redux/slices/roomsSlice'
import { STEP, dayLabel, durationLabel, intervalMinutes, isPastDate, nowMinutes, toMinutes, toTime, todayISO } from '../../data/timeGrid'
import { EquipmentList } from '../rooms/EquipmentList'
import { seats } from '../../data/plural'
import { Icon } from '../icons/Icon'
import { SlotGrid } from './SlotGrid'
import { BookingPanel } from './BookingPanel'

interface RoomScheduleProps {
  room: Room
  date: string
  canBook: boolean
}

/** Правая панель главного экрана: «проверил слот → забронировал». */
export const RoomSchedule = ({ room, date, canBook }: RoomScheduleProps) => {
  const dispatch = useAppDispatch()
  const { freeSlots, status, selection, conflict, conflictTick } = useAppSelector((s) => s.slots)
  const loaded = status === 'succeeded'
  const past = isPastDate(date)
  // Сегодня окна показываем только с ближайшего доступного получаса: прошедшее время не бронируется.
  const notBefore = date === todayISO() ? Math.ceil(nowMinutes() / STEP) * STEP : 0
  const upcomingSlots = freeSlots
    .map((slot) => ({ startTime: toTime(Math.max(toMinutes(slot.startTime), notBefore)), endTime: slot.endTime }))
    .filter((slot) => toMinutes(slot.startTime) < toMinutes(slot.endTime))

  return (
    <aside className="room-schedule" aria-label={`Расписание ${room.name}`}>
      <header className="room-schedule__head">
        <div>
          <p className="room-schedule__eyebrow">{dayLabel(date)}</p>
          <h2 className="room-schedule__name">{room.name}</h2>
          <p className="room-schedule__meta">
            Корпус {room.building} · {room.floor} этаж · {seats(room.capacity)}
          </p>
        </div>
        <button type="button" className="icon-button" onClick={() => dispatch(roomSelected(null))} aria-label="Закрыть">
          <Icon name="close" />
        </button>
      </header>

      <EquipmentList items={room.equipment} />

      <div className="room-schedule__section">
        <div className="room-schedule__section-head">
          <h3 className="room-schedule__title">Занятость</h3>
          <ul className="slot-legend">
            <li>
              <span className="legend-swatch legend-swatch--free" /> свободно
            </li>
            <li>
              <span className="legend-swatch legend-swatch--busy-hatch" /> занято
            </li>
            {canBook && (
              <li>
                <span className="legend-swatch legend-swatch--selected" /> выбрано
              </li>
            )}
          </ul>
        </div>

        {status === 'failed' ? (
          <p className="form-error">Не удалось загрузить слоты</p>
        ) : (
          <div className={`room-schedule__grid${!loaded ? ' is-loading' : ''}`}>
            <SlotGrid
              date={date}
              freeSlots={freeSlots}
              selection={canBook ? selection : null}
              conflict={conflict}
              conflictTick={conflictTick}
              readOnly={!canBook || past}
              onSelect={(interval) => dispatch(selectionChanged(interval))}
              onBlocked={(reason) =>
                dispatch(
                  pushToast(
                    reason === 'past'
                      ? { kind: 'info', title: 'Это время уже прошло', message: 'Выберите время после отметки «сейчас»' }
                      : { kind: 'info', title: 'Это время занято', message: 'Выберите свободные ячейки подряд' },
                  ),
                )
              }
            />
          </div>
        )}

        {loaded && (
          <div className="free-slots">
            <span className="free-slots__label">Свободные окна</span>
            {upcomingSlots.length === 0 ? (
              <span className="free-slots__none">
                {freeSlots.length > 0 ? 'Сегодня свободного времени больше не осталось' : 'На этот день свободного времени нет'}
              </span>
            ) : (
              <div className="free-slots__list">
                {upcomingSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    type="button"
                    className="free-slot"
                    disabled={!canBook}
                    onClick={() => dispatch(selectionChanged(slot))}
                    title={canBook ? 'Выбрать всё окно' : undefined}
                  >
                    {slot.startTime}–{slot.endTime}
                    <span className="free-slot__len">{durationLabel(intervalMinutes(slot.startTime, slot.endTime))}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {canBook ? (
        <BookingPanel roomName={room.name} date={date} freeSlots={freeSlots} />
      ) : (
        <p className="room-schedule__note">
          <Icon name="info" size={16} />
          Администратор не создаёт брони — только смотрит занятость и управляет справочником.
        </p>
      )}
    </aside>
  )
}
