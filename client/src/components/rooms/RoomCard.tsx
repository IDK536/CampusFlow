import type { RoomWithSlots, TimeInterval } from '../../api/types'
import { availabilityText, freeMinutes } from '../../data/availability'
import { DayBar } from './DayBar'
import { EquipmentList } from './EquipmentList'
import { Icon } from '../icons/Icon'

interface RoomCardProps {
  room: RoomWithSlots
  selected: boolean
  interval: TimeInterval | null
  onSelect: (id: number) => void
}

export const RoomCard = ({ room, selected, interval, onSelect }: RoomCardProps) => {
  const free = freeMinutes(room.freeSlots)
  return (
    <button
      type="button"
      className={`room-card${selected ? ' is-selected' : ''}${free === 0 ? ' is-full' : ''}`}
      onClick={() => onSelect(room.id)}
      aria-pressed={selected}
    >
      <span className="room-card__head">
        <span className="room-card__name">{room.name}</span>
        <span className="room-card__capacity" title="Вместимость">
          <Icon name="people" size={16} />
          {room.capacity}
        </span>
      </span>
      <span className="room-card__meta">
        Корпус {room.building} · {room.floor} этаж
      </span>
      <EquipmentList items={room.equipment} />
      <span className="room-card__day">
        <DayBar freeSlots={room.freeSlots} highlight={interval} />
        <span className="room-card__scale" aria-hidden="true">
          <span>9</span>
          <span>12</span>
          <span>15</span>
          <span>18</span>
        </span>
      </span>
      <span className={`room-card__free${free === 0 ? ' is-none' : ''}`}>{availabilityText(room.freeSlots)}</span>
    </button>
  )
}
