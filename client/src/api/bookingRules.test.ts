import { describe, expect, it } from 'vitest'
import type { Booking } from './types'
import { computeFreeSlots, findConflict, fitsInFreeSlots, overlaps, validateBookingTimes } from './bookingRules'

const iv = (startTime: string, endTime: string) => ({ startTime, endTime })

const booking = (patch: Partial<Booking>): Booking => ({
  id: 1,
  roomId: 4,
  roomName: 'B-101',
  userId: 1,
  userDisplayName: 'Иван Студентов',
  date: '2030-01-10',
  startTime: '14:00',
  endTime: '15:00',
  status: 'active',
  comment: '',
  ...patch,
})

describe('overlaps — правило конфликта [start, end)', () => {
  it('пересекающиеся интервалы — конфликт', () => {
    expect(overlaps(iv('14:00', '15:00'), iv('14:30', '15:30'))).toBe(true)
    expect(overlaps(iv('14:00', '16:00'), iv('14:30', '15:00'))).toBe(true)
    expect(overlaps(iv('14:00', '15:00'), iv('14:00', '15:00'))).toBe(true)
  })

  it('касание границ — не конфликт (15:00 конец и 15:00 начало)', () => {
    expect(overlaps(iv('14:00', '15:00'), iv('15:00', '16:00'))).toBe(false)
    expect(overlaps(iv('15:00', '16:00'), iv('14:00', '15:00'))).toBe(false)
  })

  it('непересекающиеся интервалы — не конфликт', () => {
    expect(overlaps(iv('09:00', '10:00'), iv('11:00', '12:00'))).toBe(false)
  })
})

describe('findConflict', () => {
  const existing = [booking({ id: 1 })]

  it('находит активную бронь той же аудитории и даты', () => {
    expect(findConflict(existing, { roomId: 4, date: '2030-01-10', ...iv('14:30', '15:30') })?.id).toBe(1)
  })

  it('игнорирует отменённые брони', () => {
    const cancelled = [booking({ status: 'cancelled' })]
    expect(findConflict(cancelled, { roomId: 4, date: '2030-01-10', ...iv('14:00', '15:00') })).toBeUndefined()
  })

  it('игнорирует другие аудитории и даты', () => {
    expect(findConflict(existing, { roomId: 5, date: '2030-01-10', ...iv('14:00', '15:00') })).toBeUndefined()
    expect(findConflict(existing, { roomId: 4, date: '2030-01-11', ...iv('14:00', '15:00') })).toBeUndefined()
  })

  it('впритык до и после — свободно', () => {
    expect(findConflict(existing, { roomId: 4, date: '2030-01-10', ...iv('13:00', '14:00') })).toBeUndefined()
    expect(findConflict(existing, { roomId: 4, date: '2030-01-10', ...iv('15:00', '16:00') })).toBeUndefined()
  })
})

describe('computeFreeSlots — максимальные свободные интервалы 09:00–18:00', () => {
  it('без броней свободен весь день', () => {
    expect(computeFreeSlots([])).toEqual([iv('09:00', '18:00')])
  })

  it('B-101 завтра из seed: занято 09:00–10:30', () => {
    expect(computeFreeSlots([iv('09:00', '10:30')])).toEqual([iv('10:30', '18:00')])
  })

  it('A-101 завтра из seed: две брони', () => {
    expect(computeFreeSlots([iv('14:00', '15:30'), iv('10:00', '11:30')])).toEqual([
      iv('09:00', '10:00'),
      iv('11:30', '14:00'),
      iv('15:30', '18:00'),
    ])
  })

  it('соседние брони склеиваются, пустых интервалов нет', () => {
    expect(computeFreeSlots([iv('10:00', '11:00'), iv('11:00', '12:00')])).toEqual([
      iv('09:00', '10:00'),
      iv('12:00', '18:00'),
    ])
  })

  it('день занят целиком — пустой список', () => {
    expect(computeFreeSlots([iv('09:00', '18:00')])).toEqual([])
  })
})

describe('fitsInFreeSlots', () => {
  const free = [iv('10:30', '14:00'), iv('15:00', '18:00')]
  it('интервал на занятом времени', () => expect(fitsInFreeSlots(free, iv('14:00', '15:00'))).toBe(false))
  it('ровно окно', () => expect(fitsInFreeSlots(free, iv('15:00', '18:00'))).toBe(true))
  it('часть окна', () => expect(fitsInFreeSlots(free, iv('11:00', '12:00'))).toBe(true))
})

describe('validateBookingTimes — правила раздела 4', () => {
  const today = '2030-01-10'
  const ok = { date: today, startTime: '14:00', endTime: '15:00' }

  it('корректная бронь проходит', () => expect(validateBookingTimes(ok, today)).toBeNull())
  it('дата в прошлом', () => expect(validateBookingTimes({ ...ok, date: '2030-01-09' }, today)).toMatch(/прошедшую/))
  it('конец ≤ начала', () => {
    expect(validateBookingTimes({ ...ok, endTime: '14:00' }, today)).toMatch(/позже/)
    expect(validateBookingTimes({ ...ok, endTime: '13:30' }, today)).toMatch(/позже/)
  })
  it('не кратно 30 минутам', () => expect(validateBookingTimes({ ...ok, startTime: '14:15' }, today)).toMatch(/30/))
  it('вне рабочего дня', () => {
    expect(validateBookingTimes({ ...ok, startTime: '08:30' }, today)).toMatch(/09:00/)
    expect(validateBookingTimes({ ...ok, endTime: '18:30' }, today)).toMatch(/18:00/)
  })
  it('границы рабочего дня допустимы', () =>
    expect(validateBookingTimes({ date: today, startTime: '09:00', endTime: '18:00' }, today)).toBeNull())
})
