import type { Booking, TimeInterval } from './types'
import { DATE_RE, DAY_END, DAY_START, STEP, TIME_RE, toMinutes, toTime, todayISO } from '../data/timeGrid'

/**
 * Полуинтервалы [start, end) пересекаются, если каждый начинается раньше, чем заканчивается другой.
 * Касание границ (15:00 конец и 15:00 начало) конфликтом не считается.
 */
export const overlaps = (a: TimeInterval, b: TimeInterval): boolean =>
  toMinutes(a.startTime) < toMinutes(b.endTime) && toMinutes(b.startTime) < toMinutes(a.endTime)

/** Активная бронь той же аудитории и даты, которая пересекается с новым интервалом. */
export const findConflict = (
  bookings: Booking[],
  candidate: { roomId: number; date: string } & TimeInterval,
  ignoreId?: number,
): Booking | undefined =>
  bookings.find(
    (b) =>
      b.id !== ignoreId &&
      b.status === 'active' &&
      b.roomId === candidate.roomId &&
      b.date === candidate.date &&
      overlaps(b, candidate),
  )

/** Максимальные непрерывные свободные интервалы внутри рабочего дня. */
export const computeFreeSlots = (busy: TimeInterval[]): TimeInterval[] => {
  const sorted = busy
    .map((b) => [Math.max(DAY_START, toMinutes(b.startTime)), Math.min(DAY_END, toMinutes(b.endTime))])
    .filter(([s, e]) => s < e)
    .sort((a, b) => a[0] - b[0])

  const free: TimeInterval[] = []
  let cursor = DAY_START
  for (const [s, e] of sorted) {
    if (s > cursor) free.push({ startTime: toTime(cursor), endTime: toTime(s) })
    cursor = Math.max(cursor, e)
  }
  if (cursor < DAY_END) free.push({ startTime: toTime(cursor), endTime: toTime(DAY_END) })
  return free
}

/** Свободные интервалы → занятые (дополнение внутри рабочего дня). */
export const invertSlots = (free: TimeInterval[]): TimeInterval[] => computeFreeSlots(free)

/** Интервал целиком помещается в один из свободных. */
export const fitsInFreeSlots = (free: TimeInterval[], interval: TimeInterval): boolean =>
  free.some(
    (f) =>
      toMinutes(f.startTime) <= toMinutes(interval.startTime) && toMinutes(interval.endTime) <= toMinutes(f.endTime),
  )

/** Единые правила валидации из раздела 4 раздатки. Возвращает текст ошибки или null. */
export const validateBookingTimes = (
  input: { date?: string; startTime?: string; endTime?: string },
  today = todayISO(),
): string | null => {
  const { date, startTime, endTime } = input
  if (!date || !startTime || !endTime) return 'Укажите дату, начало и конец брони'
  if (!DATE_RE.test(date)) return 'Дата должна быть в формате ГГГГ-ММ-ДД'
  if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) return 'Время должно быть в формате ЧЧ:ММ'
  if (date < today) return 'Нельзя бронировать на прошедшую дату'
  const s = toMinutes(startTime)
  const e = toMinutes(endTime)
  if (s % STEP || e % STEP) return 'Время начала и конца должно быть кратно 30 минутам'
  if (s >= e) return 'Конец брони должен быть позже начала'
  if (s < DAY_START || e > DAY_END) return 'Бронировать можно только с 09:00 до 18:00'
  return null
}
