import type { Equipment } from '../api/types'

export interface EquipmentInfo {
  key: Equipment
  label: string
  short: string
}

export const EQUIPMENT: EquipmentInfo[] = [
  { key: 'projector', label: 'Проектор', short: 'Проектор' },
  { key: 'whiteboard', label: 'Доска', short: 'Доска' },
  { key: 'computers', label: 'Компьютеры', short: 'ПК' },
  { key: 'audio', label: 'Звук', short: 'Звук' },
  { key: 'video', label: 'Видеосвязь', short: 'Видео' },
]

export const EQUIPMENT_KEYS: Equipment[] = EQUIPMENT.map((e) => e.key)

export const equipmentLabel = (key: Equipment): string => EQUIPMENT.find((e) => e.key === key)?.label ?? key

import type { Building } from '../api/types'

export const BUILDINGS: readonly Building[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
