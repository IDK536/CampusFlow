import type { Booking, TimeInterval } from '../api/types'
import { DAY_END, DAY_START, durationLabel, nowMinutes, toMinutes, todayISO } from './timeGrid'

export const freeMinutes = (freeSlots: TimeInterval[]): number =>
  freeSlots.reduce((sum, s) => sum + toMinutes(s.endTime) - toMinutes(s.startTime), 0)

export const availabilityText = (freeSlots: TimeInterval[]): string => {
  const free = freeMinutes(freeSlots)
  if (free === 0) return 'Занята весь день'
  if (free === DAY_END - DAY_START) return 'Свободна весь день'
  return `Свободно ${durationLabel(free)}`
}

/** Бронь уже закончилась: прошлая дата или сегодняшняя, но время конца позади. */
export const isPastBooking = (b: Booking, today = todayISO(), now = nowMinutes()): boolean =>
  b.date < today || (b.date === today && toMinutes(b.endTime) <= now)

/** Есть ли время, которое ещё можно забронировать: для сегодняшнего дня — хотя бы 30 минут после текущего момента. */
export const hasBookableTime = (freeSlots: TimeInterval[], date: string, today = todayISO(), now = nowMinutes()): boolean => {
  if (date !== today) return freeSlots.length > 0
  const nextStart = Math.ceil(now / 30) * 30
  return freeSlots.some((s) => toMinutes(s.endTime) - Math.max(nextStart, toMinutes(s.startTime)) >= 30)
}
