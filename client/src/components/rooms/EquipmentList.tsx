import type { Equipment } from '../../api/types'
import { equipmentLabel } from '../../data/equipment'
import { Icon } from '../icons/Icon'

export const EquipmentList = ({ items, compact = false }: { items: Equipment[]; compact?: boolean }) => {
  if (!items.length) return <span className="equipment-list__none">Без оборудования</span>
  return (
    <ul className={`equipment-list${compact ? ' equipment-list--compact' : ''}`}>
      {items.map((key) => (
        <li key={key} className="equipment-list__item" title={equipmentLabel(key)}>
          <Icon name={key} size={compact ? 15 : 16} />
          {!compact && <span>{equipmentLabel(key)}</span>}
        </li>
      ))}
    </ul>
  )
}
