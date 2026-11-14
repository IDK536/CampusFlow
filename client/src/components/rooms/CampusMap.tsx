import { useMemo } from 'react'
import type { Building, Room, RoomWithSlots, TimeInterval } from '../../api/types'
import { BUILDINGS } from '../../data/equipment'
import { availabilityText, freeMinutes } from '../../data/availability'
import { DAY_END, DAY_START } from '../../data/timeGrid'
import { DayBar } from './DayBar'
import { seats } from '../../data/plural'
import { Icon } from '../icons/Icon'

interface CampusMapProps {
  catalog: Room[]
  results: RoomWithSlots[]
  /** Выбранный в фильтре корпус; пусто — обзор всего кампуса. */
  building: Building | ''
  selectedId: number | null
  interval: TimeInterval | null
  onSelect: (id: number) => void
  onPickBuilding: (building: Building | '') => void
}

type CellState = 'free' | 'partial' | 'busy' | 'off'

const stateOf = (room: RoomWithSlots | undefined): CellState => {
  if (!room) return 'off'
  const free = freeMinutes(room.freeSlots)
  if (free === 0) return 'busy'
  return free === DAY_END - DAY_START ? 'free' : 'partial'
}

const Legend = () => (
  <ul className="campus-map__legend">
    <li>
      <span className="legend-swatch legend-swatch--map-free" /> свободна весь день
    </li>
    <li>
      <span className="legend-swatch legend-swatch--map-partial" /> есть брони, но есть и свободное время
    </li>
    <li>
      <span className="legend-swatch legend-swatch--busy" /> занята
    </li>
    <li>
      <span className="legend-swatch legend-swatch--off" /> не подходит под фильтры
    </li>
  </ul>
)

/**
 * Схема кампуса в два уровня. Без выбранного корпуса — обзор: по карточке на корпус со сводкой
 * (сколько подходит, сколько свободно, как заняты этажи). Выбран корпус — его этажи и аудитории
 * на всю ширину. 2000 аудиторий разом на экран не помещаются, поэтому сначала выбирают корпус.
 */
export const CampusMap = (props: CampusMapProps) => {
  const { catalog, results, building } = props
  const matched = useMemo(() => new Map(results.map((r) => [r.id, r])), [results])
  const rooms = catalog.length ? catalog : results

  return building ? (
    <BuildingPlan {...props} building={building} rooms={rooms} matched={matched} />
  ) : (
    <CampusOverview {...props} rooms={rooms} matched={matched} />
  )
}

interface InnerProps extends CampusMapProps {
  rooms: Room[]
  matched: Map<number, RoomWithSlots>
}

const CampusOverview = ({ rooms, matched, selectedId, onPickBuilding }: InnerProps) => {
  const selectedBuilding = rooms.find((r) => r.id === selectedId)?.building
  return (
    <div className="campus-map">
      <p className="campus-map__intro">Выберите корпус, чтобы увидеть его этажи и аудитории.</p>
      <div className="campus-overview">
        {BUILDINGS.map((b) => {
          const inBuilding = rooms.filter((r) => r.building === b)
          const counts = { free: 0, partial: 0, busy: 0, off: 0 }
          for (const r of inBuilding) counts[stateOf(matched.get(r.id))] += 1
          const fits = inBuilding.length - counts.off
          const floors = [...new Set(inBuilding.map((r) => r.floor))].sort((x, y) => x - y)
          const share = (n: number) => (inBuilding.length ? `${(n / inBuilding.length) * 100}%` : '0%')
          return (
            <button
              key={b}
              type="button"
              className={`building-tile${fits === 0 ? ' is-empty' : ''}${b === selectedBuilding ? ' is-current' : ''}`}
              onClick={() => onPickBuilding(b)}
              aria-label={`Корпус ${b}: подходят ${fits} из ${inBuilding.length}, свободны весь день ${counts.free}`}
            >
              <span className="building-tile__head">
                <span className="building-tile__letter">{b}</span>
                <span className="building-tile__fits">
                  <strong>{fits}</strong> из {inBuilding.length}
                </span>
              </span>

              <span className="building-tile__bar" aria-hidden="true">
                <span className="building-tile__seg building-tile__seg--free" style={{ width: share(counts.free) }} />
                <span className="building-tile__seg building-tile__seg--partial" style={{ width: share(counts.partial) }} />
                <span className="building-tile__seg building-tile__seg--busy" style={{ width: share(counts.busy) }} />
              </span>

              <span className="building-tile__stats">
                <span>
                  <i className="dot dot--free" /> {counts.free} свободны
                </span>
                <span>
                  <i className="dot dot--partial" /> {counts.partial} с окнами
                </span>
              </span>

              <span className="building-tile__floors" aria-hidden="true" title="Этажи: чем ярче, тем больше свободных аудиторий">
                {floors.map((f) => {
                  const onFloor = inBuilding.filter((r) => r.floor === f)
                  const freeOnFloor = onFloor.filter((r) => stateOf(matched.get(r.id)) === 'free').length
                  const level = onFloor.length ? freeOnFloor / onFloor.length : 0
                  return (
                    <span key={f} className="building-tile__floor" style={{ opacity: 0.25 + level * 0.75 }}>
                      {f}
                    </span>
                  )
                })}
              </span>

              <span className="building-tile__go">
                Открыть <Icon name="arrowRight" size={14} />
              </span>
            </button>
          )
        })}
      </div>
      <ul className="campus-map__legend">
        <li>
          <span className="legend-swatch legend-swatch--map-free" /> свободна весь день
        </li>
        <li>
          <span className="legend-swatch legend-swatch--map-partial" /> есть брони, но есть и свободное время
        </li>
        <li>
          <span className="legend-swatch legend-swatch--busy" /> занята
        </li>
        <li>этажи: ярче — больше свободных</li>
      </ul>
    </div>
  )
}

const BuildingPlan = ({
  rooms,
  matched,
  building,
  selectedId,
  interval,
  onSelect,
  onPickBuilding,
}: InnerProps & { building: Building }) => {
  const inBuilding = rooms.filter((r) => r.building === building)
  const floors = [...new Set(inBuilding.map((r) => r.floor))].sort((a, b) => b - a)
  const matchCount = inBuilding.filter((r) => matched.has(r.id)).length
  const index = BUILDINGS.indexOf(building)
  const prev = BUILDINGS[index - 1]
  const next = BUILDINGS[index + 1]

  return (
    <div className="campus-map">
      <section className="campus-map__building campus-map__building--wide" aria-label={`Корпус ${building}`}>
        <header className="campus-map__building-head">
          <button type="button" className="link-button campus-map__back" onClick={() => onPickBuilding('')}>
            <Icon name="arrowLeft" size={16} /> Все корпуса
          </button>
          <span className="campus-map__title">
            <span className="campus-map__letter">{building}</span>
            <span className="campus-map__count">
              подходят {matchCount} из {inBuilding.length}
            </span>
          </span>
          <span className="campus-map__nav">
            <button
              type="button"
              className="icon-button"
              disabled={!prev}
              onClick={() => prev && onPickBuilding(prev)}
              aria-label="Предыдущий корпус"
            >
              <Icon name="arrowLeft" />
            </button>
            <button
              type="button"
              className="icon-button"
              disabled={!next}
              onClick={() => next && onPickBuilding(next)}
              aria-label="Следующий корпус"
            >
              <Icon name="arrowRight" />
            </button>
          </span>
        </header>
        {floors.length === 0 && <p className="campus-map__empty">Нет аудиторий</p>}
        {floors.map((floor) => (
          <div key={floor} className="campus-map__floor">
            <span className="campus-map__floor-num" title={`${floor} этаж`}>
              {floor}
            </span>
            <div className="campus-map__rooms">
              {inBuilding
                .filter((r) => r.floor === floor)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((room) => {
                  const match = matched.get(room.id)
                  const state = stateOf(match)
                  return (
                    <button
                      key={room.id}
                      type="button"
                      className={`map-room map-room--${state}${room.id === selectedId ? ' is-selected' : ''}`}
                      onClick={() => onSelect(room.id)}
                      title={match ? `${room.name}: ${availabilityText(match.freeSlots)}` : `${room.name}: не подходит под фильтры`}
                      aria-pressed={room.id === selectedId}
                    >
                      <span className="map-room__name">{room.name.split('-')[1] ?? room.name}</span>
                      <span className="map-room__cap">{seats(room.capacity)}</span>
                      {match && <DayBar freeSlots={match.freeSlots} highlight={interval} />}
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </section>
      <Legend />
    </div>
  )
}
