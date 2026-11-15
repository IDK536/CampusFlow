import type { Building, Equipment, RoomWithSlots, TimeInterval } from '../api/types'
import { DAY_END, STEP, durationLabel, toMinutes, toTime } from './timeGrid'
import { equipmentLabel } from './equipment'
import { seats } from './plural'

/**
 * Подбор трёх аудиторий без ML: прозрачная формула с весами, каждое слагаемое
 * превращается в понятную причину «почему подошла».
 *
 * Два режима времени:
 * - «точное» (exact): нужно с … до …. Если аудитория свободна всё это время — предлагаем ровно его,
 *   если нет — самый длинный свободный кусок внутри.
 * - «в промежутке» (flexible): нужно durationMin минут где-то между windowStart и windowEnd
 *   (например, созвон на час с 10 до 16). Ищем самое раннее подходящее окно нужной длины.
 */
export type TimeMode = 'exact' | 'flexible'

export interface RecommendParams {
  people: number
  timeMode: TimeMode
  windowStart: string
  windowEnd: string
  /** Длительность для режима «в промежутке». */
  durationMin: number
  equipment: Equipment[]
  building: Building | ''
  /** Предпочтительный этаж; null — любой. */
  floor: number | null
}

export interface Recommendation {
  room: RoomWithSlots
  interval: TimeInterval
  /** true — аудитория закрывает запрос целиком (всё время или окно нужной длины). */
  full: boolean
  score: number
  reasons: string[]
}

/** time — насколько хорошо по времени: покрытие (точное) или раннее начало (в промежутке). */
const WEIGHTS = { time: 0.45, fit: 0.25, building: 0.15, floor: 0.15 }

const roundUpToStep = (minutes: number) => Math.ceil(minutes / STEP) * STEP

interface Found {
  start: number
  end: number
  slotEnd: number
}

/** Самый длинный свободный кусок внутри [from, to); при равной длине — более ранний. */
export const bestWindow = (freeSlots: TimeInterval[], from: number, to: number): Found | null => {
  let best: Found | null = null
  for (const slot of freeSlots) {
    const start = roundUpToStep(Math.max(toMinutes(slot.startTime), from))
    const slotEnd = toMinutes(slot.endTime)
    const end = Math.min(slotEnd, to)
    if (end - start < STEP) continue
    if (!best || end - start > best.end - best.start) best = { start, end, slotEnd }
  }
  return best
}

/** Самое раннее окно длиной durationMin внутри [from, to). */
export const earliestWindow = (freeSlots: TimeInterval[], durationMin: number, from: number, to: number): Found | null => {
  for (const slot of freeSlots) {
    const start = roundUpToStep(Math.max(toMinutes(slot.startTime), from))
    const slotEnd = toMinutes(slot.endTime)
    if (start + durationMin <= Math.min(slotEnd, to)) return { start, end: start + durationMin, slotEnd }
  }
  return null
}

export const recommendRooms = (
  rooms: RoomWithSlots[],
  params: RecommendParams,
  options: { notBefore?: number; limit?: number } = {},
): Recommendation[] => {
  const { people, equipment, building } = params
  const floor = params.floor ?? null
  const flexible = params.timeMode === 'flexible'
  const windowStart = Math.max(toMinutes(params.windowStart), roundUpToStep(options.notBefore ?? 0))
  const windowEnd = toMinutes(params.windowEnd)
  const wanted = flexible ? params.durationMin : windowEnd - windowStart
  if (wanted < STEP || windowEnd - windowStart < wanted) return []
  // Насколько можно сдвинуть начало внутри промежутка — для оценки «чем раньше, тем лучше».
  const span = Math.max(STEP, windowEnd - wanted - windowStart)

  const scored: Recommendation[] = []
  for (const room of rooms) {
    if (room.capacity < people) continue
    if (!equipment.every((e) => room.equipment.includes(e))) continue
    const found = flexible
      ? earliestWindow(room.freeSlots, wanted, windowStart, windowEnd)
      : bestWindow(room.freeSlots, windowStart, windowEnd)
    if (!found) continue

    const length = found.end - found.start
    const full = length === wanted
    const timeScore = flexible ? 1 - (found.start - windowStart) / span : length / wanted
    const fit = people / room.capacity
    const buildingScore = building ? (room.building === building ? 1 : 0) : 0.5
    // Нужный этаж — 1, соседний — 0,67, через один — 0,33, дальше — 0.
    const floorGap = floor ? Math.abs(room.floor - floor) : null
    const floorScore = floorGap === null ? 0.5 : Math.max(0, 1 - floorGap / 3)
    const score =
      WEIGHTS.time * timeScore + WEIGHTS.fit * fit + WEIGHTS.building * buildingScore + WEIGHTS.floor * floorScore

    const reasons: string[] = []
    if (flexible) {
      reasons.push(
        found.start === windowStart
          ? `Свободна сразу: ${toTime(found.start)}–${toTime(found.end)}`
          : `Ближайшее окно на ${durationLabel(wanted)} — с ${toTime(found.start)}`,
      )
    } else {
      reasons.push(
        full
          ? `Свободна всё нужное время: ${toTime(windowStart)}–${toTime(windowEnd)}`
          : `Свободна ${durationLabel(length)} из ${durationLabel(wanted)} — самый удобный кусок`,
      )
    }
    const spare = room.capacity - people
    reasons.push(
      spare === 0
        ? `Ровно ${seats(room.capacity)} — под вашу группу`
        : fit >= 0.7
          ? `${seats(room.capacity)} на ${people} чел. — зал не будет пустовать`
          : `${seats(room.capacity)} на ${people} чел. — запас ${spare}`,
    )
    if (building && room.building === building) reasons.push(`Корпус ${building}, как вы и хотели`)
    if (floorGap === 0) reasons.push(`${room.floor} этаж, как вы и хотели`)
    else if (floorGap === 1) reasons.push(`${room.floor} этаж — на один от нужного`)
    const after = found.slotEnd - found.end
    if (full && after >= 60) reasons.push(`После вас свободна ещё ${durationLabel(after)}`)
    else if (after === 0 && found.slotEnd < DAY_END) reasons.push('Сразу после вас аудиторию занимают — не задерживайтесь')
    if (equipment.length) reasons.push(`Есть ${equipment.map((e) => equipmentLabel(e).toLowerCase()).join(', ')}`)

    scored.push({
      room,
      interval: { startTime: toTime(found.start), endTime: toTime(found.end) },
      full,
      score: Math.round(score * 100),
      reasons,
    })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.room.capacity - b.room.capacity || a.room.name.localeCompare(b.room.name))
    .slice(0, options.limit ?? 3)
}
