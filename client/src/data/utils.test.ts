import { describe, expect, it } from 'vitest'
import type { Booking, Room } from '../api/types'
import { plural, seats } from './plural'
import { addDaysISO, isValidISODate, relativeDayLabel } from './timeGrid'
import { availabilityText, hasBookableTime, isPastBooking } from './availability'
import { buildLoadReport } from './stats'
import roomsReducer, { roomSelected } from '../redux/slices/roomsSlice'
import slotsReducer, { conflictDetected, selectionChanged, slotsRequested } from '../redux/slices/slotsSlice'
import uiReducer, { themeChanged } from '../redux/slices/uiSlice'
import { loggedOut, loginSucceeded } from '../redux/slices/authSlice'

describe('склонения', () => {
  it.each([
    [1, '1 место'],
    [2, '2 места'],
    [5, '5 мест'],
    [11, '11 мест'],
    [21, '21 место'],
    [24, '24 места'],
    [112, '112 мест'],
  ])('%i', (n, text) => expect(seats(n)).toBe(text))

  it('брони', () => expect(plural(3, ['бронь', 'брони', 'броней'])).toBe('3 брони'))
})

describe('даты', () => {
  it('отбрасывает несуществующие даты из URL', () => {
    expect(isValidISODate('2026-11-15')).toBe(true)
    expect(isValidISODate('2026-13-45')).toBe(false)
    expect(isValidISODate('2026-02-30')).toBe(false)
    expect(isValidISODate('завтра')).toBe(false)
  })

  it('переход через конец месяца и подписи дней', () => {
    expect(addDaysISO('2026-11-30', 1)).toBe('2026-12-01')
    expect(relativeDayLabel('2026-11-15', '2026-11-14')).toBe('Завтра')
    expect(relativeDayLabel('2026-11-20', '2026-11-14')).toBeNull()
  })
})

describe('доступность и прошедшие брони', () => {
  it('текст свободного времени', () => {
    expect(availabilityText([])).toBe('Занята весь день')
    expect(availabilityText([{ startTime: '09:00', endTime: '18:00' }])).toBe('Свободна весь день')
    expect(availabilityText([{ startTime: '10:30', endTime: '18:00' }])).toBe('Свободно 7 ч 30 мин')
  })

  it('занятые весь день и «свободно только в прошлом» не считаются свободными', () => {
    const morning = [{ startTime: '09:00', endTime: '11:00' }]
    expect(hasBookableTime([], '2026-11-15', '2026-11-14')).toBe(false)
    expect(hasBookableTime(morning, '2026-11-15', '2026-11-14')).toBe(true)
    expect(hasBookableTime(morning, '2026-11-14', '2026-11-14', 10 * 60 + 40)).toBe(false)
    expect(hasBookableTime(morning, '2026-11-14', '2026-11-14', 10 * 60 + 20)).toBe(true)
  })

  it('бронь сегодня прошла только после её окончания', () => {
    const b = { date: '2026-11-14', endTime: '12:00' } as Booking
    expect(isPastBooking(b, '2026-11-14', 11 * 60 + 59)).toBe(false)
    expect(isPastBooking(b, '2026-11-14', 12 * 60)).toBe(true)
    expect(isPastBooking(b, '2026-11-15', 0)).toBe(true)
  })
})

describe('статистика загрузки', () => {
  const rooms = [
    { id: 1, name: 'A-101', building: 'A', floor: 1, capacity: 30, equipment: [] },
    { id: 2, name: 'B-101', building: 'B', floor: 1, capacity: 30, equipment: [] },
  ] as Room[]
  const booking = (id: number, roomId: number, startTime: string, endTime: string, status: Booking['status'] = 'active') =>
    ({ id, roomId, roomName: '', userId: 1, userDisplayName: '', date: '2026-11-15', startTime, endTime, status, comment: '' }) as Booking

  it('считает только активные брони выбранных дней', () => {
    const report = buildLoadReport(
      [booking(1, 1, '09:00', '13:30'), booking(2, 1, '14:00', '15:00', 'cancelled'), booking(3, 2, '10:00', '11:00')],
      rooms,
      ['2026-11-15'],
    )
    expect(report.totalBookings).toBe(2)
    expect(report.byBuilding.A.percent).toBe(50) // 4,5 ч из 9
    expect(report.topRooms[0].name).toBe('A-101')
    expect(report.byHalfHour[2]).toBe(2) // 10:00–10:30 занято в обеих
  })
})

describe('редьюсеры', () => {
  const session = { token: 't', user: { id: 2, login: 'student2', displayName: 'Мария', role: 'student' as const } }

  it('смена пользователя снимает выбранную аудиторию и сбрасывает шкалу', () => {
    let rooms = roomsReducer(undefined, roomSelected(4))
    rooms = roomsReducer(rooms, loginSucceeded(session))
    expect(rooms.selectedRoomId).toBeNull()

    let slots = slotsReducer(undefined, slotsRequested({ roomId: 4, date: '2026-11-15' }))
    slots = slotsReducer(slots, selectionChanged({ startTime: '14:00', endTime: '15:00' }))
    slots = slotsReducer(slots, loggedOut())
    expect(slots.roomId).toBeNull()
    expect(slots.selection).toBeNull()
  })

  it('конфликт подсвечивает интервал из ответа и перезапускает анимацию', () => {
    let slots = slotsReducer(undefined, selectionChanged({ startTime: '14:00', endTime: '15:00' }))
    slots = slotsReducer(slots, conflictDetected({ startTime: '14:30', endTime: '16:00' }))
    expect(slots.conflict).toEqual({ startTime: '14:30', endTime: '16:00' })
    expect(slots.conflictTick).toBe(1)
    slots = slotsReducer(slots, selectionChanged(null))
    expect(slots.conflict).toBeNull()
  })

  it('тема хранится в состоянии', () => {
    expect(uiReducer(undefined, themeChanged('amoled')).theme).toBe('amoled')
  })
})
