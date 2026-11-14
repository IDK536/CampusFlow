import { useMemo } from 'react'
import type { Building, Equipment } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { filtersChanged, filtersReset } from '../../redux/slices/roomsSlice'
import { EQUIPMENT } from '../../data/equipment'
import { BuildingSelect } from '../ui/BuildingSelect'
import { TimePicker } from '../ui/TimePicker'
import { addDaysISO, formatDateShort, formatWeekday, parseISODate, relativeDayLabel, todayISO } from '../../data/timeGrid'
import { Icon } from '../icons/Icon'

const DAYS_AHEAD = 7

export const RoomFilters = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.rooms.filters)
  const today = todayISO()
  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => addDaysISO(today, i)), [today])
  const change = (patch: Parameters<typeof filtersChanged>[0]) => dispatch(filtersChanged(patch))

  const toggleEquipment = (key: Equipment) =>
    change({
      equipment: filters.equipment.includes(key)
        ? filters.equipment.filter((e) => e !== key)
        : [...filters.equipment, key],
    })

  const isDirty = filters.building || filters.minCapacity || filters.equipment.length || filters.timeMode !== 'any'
  const otherDate = !days.includes(filters.date)

  return (
    <section className="room-filters" aria-label="Параметры поиска">
      <div className="room-filters__row">
        <div className="room-filters__group room-filters__group--days">
          <span className="room-filters__label">День</span>
          <div className="day-picker">
            {days.map((iso) => (
              <button
                key={iso}
                type="button"
                className={`day-picker__day${filters.date === iso ? ' is-active' : ''}`}
                onClick={() => change({ date: iso })}
                aria-pressed={filters.date === iso}
              >
                <span className="day-picker__weekday">{relativeDayLabel(iso, today) ?? formatWeekday(iso)}</span>
                <span className="day-picker__num">{parseISODate(iso).getDate()}</span>
              </button>
            ))}
            <label className={`day-picker__other${otherDate ? ' is-active' : ''}`} title="Выбрать другую дату">
              <span className="day-picker__weekday">{otherDate ? formatWeekday(filters.date) : 'Другая'}</span>
              {otherDate ? (
                <span className="day-picker__num">{formatDateShort(filters.date)}</span>
              ) : (
                <Icon name="calendar" size={20} />
              )}
              <input
                type="date"
                className="day-picker__native"
                min={today}
                value={filters.date}
                aria-label="Другая дата"
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => e.target.value && change({ date: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="room-filters__group room-filters__group--time">
          <TimePicker
            allowAny
            labelClassName="room-filters__label"
            value={{ mode: filters.timeMode, start: filters.startTime, end: filters.endTime, durationMin: filters.durationMin }}
            onChange={(v) => change({ timeMode: v.mode, startTime: v.start, endTime: v.end, durationMin: v.durationMin })}
          />
        </div>
      </div>

      <div className="room-filters__row">
        <div className="room-filters__group">
          <span className="room-filters__label">Корпус</span>
          <BuildingSelect<Building | ''> value={filters.building} onChange={(building) => change({ building })} anyLabel="Все корпуса" />
        </div>

        <div className="room-filters__group">
          <label className="room-filters__label" htmlFor="min-capacity">Сколько человек</label>
          <input
            id="min-capacity"
            className="input input--narrow"
            type="number"
            min={1}
            max={500}
            inputMode="numeric"
            placeholder="любое"
            value={filters.minCapacity ?? ''}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10)
              change({ minCapacity: Number.isFinite(n) && n > 0 ? n : null })
            }}
          />
        </div>

        <div className="room-filters__group room-filters__group--grow">
          <span className="room-filters__label">Что нужно в аудитории</span>
          <div className="chip-row">
            {EQUIPMENT.map((e) => {
              const active = filters.equipment.includes(e.key)
              return (
                <button
                  key={e.key}
                  type="button"
                  className={`chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => toggleEquipment(e.key)}
                >
                                    {e.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Кнопка всегда занимает место — иначе при её появлении строка фильтров перестраивается. */}
        <button
          type="button"
          className={`link-button room-filters__reset${isDirty ? '' : ' is-hidden'}`}
          onClick={() => dispatch(filtersReset())}
          tabIndex={isDirty ? 0 : -1}
          aria-hidden={!isDirty}
        >
          Сбросить фильтры
        </button>
      </div>
    </section>
  )
}
