import type { RoomWithSlots, TimeInterval } from '../../api/types'
import { RoomCard } from './RoomCard'

interface RoomListProps {
  rooms: RoomWithSlots[]
  selectedId: number | null
  interval: TimeInterval | null
  onSelect: (id: number) => void
}

export const RoomList = ({ rooms, selectedId, interval, onSelect }: RoomListProps) => (
  <div className="room-list">
    {rooms.map((room, i) => (
      <div key={room.id} className="room-list__item" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
        <RoomCard room={room} selected={room.id === selectedId} interval={interval} onSelect={onSelect} />
      </div>
    ))}
  </div>
)
