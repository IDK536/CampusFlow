import type { Booking, Building, Room } from '../api/types'
import { BUILDINGS } from './equipment'
import { DAY_END, DAY_START, GRID_STARTS, intervalMinutes, toMinutes } from './timeGrid'

/** Аналитика загрузки по дням и корпусам — считается на клиенте из списка всех броней. */
export interface LoadCell {
  building: Building
  date: string
  minutes: number
  bookings: number
  capacityMinutes: number
  percent: number
}

export interface LoadReport {
  cells: LoadCell[]
  byBuilding: Record<Building, { minutes: number; percent: number; rooms: number }>
  byDay: Record<string, { minutes: number; percent: number; bookings: number }>
  byHalfHour: number[]
  topRooms: { roomId: number; name: string; minutes: number; bookings: number }[]
  totalBookings: number
  totalMinutes: number
  averagePercent: number
}

const DAY_MINUTES = DAY_END - DAY_START
export const TOP_ROOMS = 10
// Проценты не округляем: при 2000 аудиториях загрузка корпуса бывает 0,4%, и округление до целого
// превращает реальные брони в «0%». Округление — только при выводе, через formatPercent.
const pct = (part: number, whole: number) => (whole ? (part / whole) * 100 : 0)

/** 12% · 3,4% · <0,1% · 0%. До 10% — с одним знаком после запятой. */
export const formatPercent = (value: number): string => {
  if (value <= 0) return '0%'
  if (value < 0.1) return '<0,1%'
  if (value < 10) return `${value.toFixed(1).replace('.', ',').replace(/,0$/, '')}%`
  return `${Math.round(value)}%`
}

export const buildLoadReport = (bookings: Booking[], rooms: Room[], dates: string[]): LoadReport => {
  const roomById = new Map(rooms.map((r) => [r.id, r]))
  const dateSet = new Set(dates)
  const active = bookings.filter((b) => b.status === 'active' && dateSet.has(b.date) && roomById.has(b.roomId))

  const roomsIn = (building: Building) => rooms.filter((r) => r.building === building).length

  const cells: LoadCell[] = []
  for (const building of BUILDINGS) {
    for (const date of dates) {
      const list = active.filter((b) => b.date === date && roomById.get(b.roomId)!.building === building)
      const minutes = list.reduce((sum, b) => sum + intervalMinutes(b.startTime, b.endTime), 0)
      const capacityMinutes = roomsIn(building) * DAY_MINUTES
      cells.push({ building, date, minutes, bookings: list.length, capacityMinutes, percent: pct(minutes, capacityMinutes) })
    }
  }

  const byBuilding = Object.fromEntries(
    BUILDINGS.map((building) => {
      const own = cells.filter((c) => c.building === building)
      const minutes = own.reduce((s, c) => s + c.minutes, 0)
      const capacity = own.reduce((s, c) => s + c.capacityMinutes, 0)
      return [building, { minutes, percent: pct(minutes, capacity), rooms: roomsIn(building) }]
    }),
  ) as LoadReport['byBuilding']

  const byDay = Object.fromEntries(
    dates.map((date) => {
      const own = cells.filter((c) => c.date === date)
      const minutes = own.reduce((s, c) => s + c.minutes, 0)
      const capacity = own.reduce((s, c) => s + c.capacityMinutes, 0)
      return [date, { minutes, percent: pct(minutes, capacity), bookings: own.reduce((s, c) => s + c.bookings, 0) }]
    }),
  )

  const byHalfHour = GRID_STARTS.map(
    (start) => active.filter((b) => toMinutes(b.startTime) <= start && start < toMinutes(b.endTime)).length,
  )

  const perRoom = new Map<number, { minutes: number; bookings: number }>()
  for (const b of active) {
    const entry = perRoom.get(b.roomId) ?? { minutes: 0, bookings: 0 }
    entry.minutes += intervalMinutes(b.startTime, b.endTime)
    entry.bookings += 1
    perRoom.set(b.roomId, entry)
  }
  const topRooms = [...perRoom.entries()]
    .map(([roomId, v]) => ({ roomId, name: roomById.get(roomId)!.name, ...v }))
    .sort((a, b) => b.minutes - a.minutes || a.name.localeCompare(b.name))
    .slice(0, TOP_ROOMS)

  const totalMinutes = active.reduce((s, b) => s + intervalMinutes(b.startTime, b.endTime), 0)
  const totalCapacity = rooms.length * DAY_MINUTES * dates.length

  return {
    cells,
    byBuilding,
    byDay,
    byHalfHour,
    topRooms,
    totalBookings: active.length,
    totalMinutes,
    averagePercent: pct(totalMinutes, totalCapacity),
  }
}
