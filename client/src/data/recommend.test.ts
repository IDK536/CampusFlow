import { describe, expect, it } from 'vitest'
import type { RoomWithSlots } from '../api/types'
import { recommendRooms, type RecommendParams } from './recommend'
import { bookingsToCsv } from './csv'
import { createUnsignedJwt, decodeJwt, isTokenExpired } from '../api/jwt'

const room = (id: number, name: string, capacity: number, freeSlots = [{ startTime: '09:00', endTime: '18:00' }]): RoomWithSlots => ({
  id,
  name,
  building: name[0] as RoomWithSlots['building'],
  floor: 1,
  capacity,
  equipment: ['projector'],
  freeSlots,
})

const params: RecommendParams = {
  people: 20,
  timeMode: 'exact',
  durationMin: 60,
  windowStart: '09:00',
  windowEnd: '18:00',
  equipment: [],
  building: '',
  floor: null,
}

describe('recommendRooms', () => {
  it('возвращает не больше трёх и только подходящие по вместимости', () => {
    const rooms = [room(1, 'A-1', 10), room(2, 'A-2', 20), room(3, 'B-1', 25), room(4, 'C-1', 60), room(5, 'D-1', 30)]
    const result = recommendRooms(rooms, params)
    expect(result).toHaveLength(3)
    expect(result.every((r) => r.room.capacity >= 20)).toBe(true)
    expect(result[0].room.name).toBe('A-2') // вместимость впритык
  })

  it('отдаёт всё нужное время, если аудитория свободна', () => {
    const [rec] = recommendRooms([room(1, 'A-1', 20)], { ...params, windowStart: '10:00', windowEnd: '12:00' })
    expect(rec.interval).toEqual({ startTime: '10:00', endTime: '12:00' })
    expect(rec.full).toBe(true)
  })

  it('если целиком не свободна — берёт самый длинный кусок и ставит полные выше', () => {
    const partial = room(1, 'A-1', 20, [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '12:00', endTime: '15:00' },
    ])
    const free = room(2, 'B-1', 60)
    const result = recommendRooms([partial, free], { ...params, windowStart: '09:00', windowEnd: '14:00' })
    expect(result[0].room.name).toBe('B-1')
    const rec = result.find((r) => r.room.name === 'A-1')!
    expect(rec.interval).toEqual({ startTime: '12:00', endTime: '14:00' })
    expect(rec.full).toBe(false)
  })

  it('учитывает «не раньше чем сейчас» и предпочтительный корпус', () => {
    const rooms = [room(1, 'A-1', 22), room(2, 'B-1', 22)]
    const result = recommendRooms(rooms, { ...params, building: 'B' }, { notBefore: 13 * 60 + 10 })
    expect(result[0].room.name).toBe('B-1')
    expect(result[0].interval).toEqual({ startTime: '13:30', endTime: '18:00' })
    expect(result[0].reasons.some((r) => r.includes('Корпус B'))).toBe(true)
  })

  it('в промежутке: ищет самое раннее окно нужной длины', () => {
    const busyMorning = room(1, 'A-1', 20, [
      { startTime: '09:00', endTime: '10:30' },
      { startTime: '12:00', endTime: '18:00' },
    ])
    const flexible = { ...params, timeMode: 'flexible' as const, durationMin: 120, windowStart: '10:00', windowEnd: '16:00' }
    const [rec] = recommendRooms([busyMorning], flexible)
    expect(rec.interval).toEqual({ startTime: '12:00', endTime: '14:00' })
    expect(rec.full).toBe(true)
    // Окна нужной длины в промежутке нет — аудитория не подходит.
    expect(recommendRooms([busyMorning], { ...flexible, windowEnd: '13:00' })).toEqual([])
  })

  it('в промежутке: при прочих равных выше та, что свободна раньше', () => {
    const early = room(1, 'A-1', 20)
    const late = room(2, 'A-2', 20, [{ startTime: '14:00', endTime: '18:00' }])
    const flexible = { ...params, timeMode: 'flexible' as const, durationMin: 60, windowStart: '10:00', windowEnd: '16:00' }
    const result = recommendRooms([late, early], flexible)
    expect(result.map((r) => r.room.name)).toEqual(['A-1', 'A-2'])
    expect(result[0].interval).toEqual({ startTime: '10:00', endTime: '11:00' })
  })

  it('учитывает предпочтительный этаж', () => {
    const low = { ...room(1, 'A-1', 22), floor: 1 }
    const high = { ...room(2, 'A-2', 22), floor: 3 }
    const result = recommendRooms([low, high], { ...params, floor: 3 })
    expect(result[0].room.name).toBe('A-2')
    expect(result[0].reasons).toContain('3 этаж, как вы и хотели')
  })

  it('пропускает аудитории без нужного оборудования', () => {
    expect(recommendRooms([room(1, 'A-1', 30)], { ...params, equipment: ['video'] })).toEqual([])
  })
})

describe('bookingsToCsv', () => {
  it('BOM, разделитель «;», экранирование кавычек и защита от формул', () => {
    const csv = bookingsToCsv([
      {
        id: 1,
        roomId: 1,
        roomName: 'A-101',
        userId: 1,
        userDisplayName: 'Иван Студентов',
        date: '2030-01-10',
        startTime: '10:00',
        endTime: '11:30',
        status: 'active',
        comment: '=HYPERLINK("x"); "семинар"',
      },
    ])
    expect(csv.startsWith('﻿')).toBe(true)
    const [header, row] = csv.slice(1).split('\r\n')
    expect(header.split(';')).toHaveLength(9)
    expect(row).toContain('"\'=HYPERLINK(""x""); ""семинар"""')
  })
})

describe('jwt', () => {
  it('читает payload и срок действия', () => {
    const token = createUnsignedJwt({ sub: 1, login: 'student1', exp: 100 })
    expect(decodeJwt(token)).toMatchObject({ sub: 1, login: 'student1' })
    expect(isTokenExpired(token, 99_000)).toBe(false)
    expect(isTokenExpired(token, 100_000)).toBe(true)
    expect(isTokenExpired('mock-token-student1')).toBe(false)
  })
})
