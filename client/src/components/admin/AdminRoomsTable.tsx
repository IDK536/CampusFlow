import type { Room } from '../../api/types'
import { EquipmentList } from '../rooms/EquipmentList'
import { Icon } from '../icons/Icon'

interface AdminRoomsTableProps {
  rooms: Room[]
  activeByRoom: Map<number, number>
  deletingId: number | null
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
}

export const AdminRoomsTable = ({ rooms, activeByRoom, deletingId, onEdit, onDelete }: AdminRoomsTableProps) => (
  <div className="data-table-wrap">
    <table className="data-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Корпус</th>
          <th>Этаж</th>
          <th>Мест</th>
          <th>Оборудование</th>
          <th>Активных броней</th>
          <th aria-label="Действия" />
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <td data-label="Название" className="data-table__strong">
              {room.name}
            </td>
            <td data-label="Корпус">{room.building}</td>
            <td data-label="Этаж">{room.floor}</td>
            <td data-label="Мест">{room.capacity}</td>
            <td data-label="Оборудование">
              <EquipmentList items={room.equipment} />
            </td>
            <td data-label="Активных броней">{activeByRoom.get(room.id) ?? 0}</td>
            <td className="data-table__actions">
              <button type="button" className="icon-button" onClick={() => onEdit(room)} aria-label={`Изменить ${room.name}`} title="Изменить">
                <Icon name="edit" />
              </button>
              <button
                type="button"
                className="icon-button icon-button--danger"
                onClick={() => onDelete(room)}
                disabled={deletingId === room.id}
                aria-label={`Удалить ${room.name}`}
                title="Удалить"
              >
                <Icon name="trash" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
