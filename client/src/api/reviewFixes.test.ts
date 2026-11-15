import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './api'
import { clearSession, getAccessToken, onSessionEvent, refreshSession, setRefresher, setSession } from './session'
import { createMockGateway } from './mockGateway'
import type { KeyValueStorage } from './storage'
import { fieldErrors } from '../redux/saga/adminSaga'
import { BUILDINGS } from '../data/equipment'
import { SEED_ROOMS } from './mockData'

const memoryStorage = (): KeyValueStorage => {
  const map = new Map<string, string>()
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) }
}

const user = { id: 1, login: 'student1', displayName: 'Иван Студентов', role: 'student' as const }

describe('refresh внутри вкладки', () => {
  beforeEach(() => clearSession())

  it('параллельные обновления идут одним запросом', async () => {
    const refresh = vi.fn(async () => ({ token: 'new', user }))
    setRefresher(refresh)
    setSession({ token: 'old', user })
    await Promise.all([refreshSession(), refreshSession(), refreshSession()])
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(getAccessToken()).toBe('new')
  })

  it('401 самого refresh завершает вход', async () => {
    setRefresher(async () => {
      throw new ApiError(401, { code: 'UNAUTHORIZED', message: 'нет' })
    })
    setSession({ token: 'old', user })
    const events: string[] = []
    const off = onSessionEvent((e) => events.push(e.type))
    await expect(refreshSession()).rejects.toBeInstanceOf(ApiError)
    off()
    expect(getAccessToken()).toBeNull()
    expect(events).toEqual(['lost'])
  })
})

describe('ошибки полей из details', () => {
  it('принимает массивы, JSON-пути и неизвестные поля', () => {
    expect(
      fieldErrors({
        name: ['Аудитория с таким названием уже существует'],
        '$.floor': ['Неверный формат'],
        Capacity: 'Больше 0',
        request: ['Тело запроса пустое'],
      }),
    ).toEqual({
      fields: { name: 'Аудитория с таким названием уже существует', floor: 'Неверный формат', capacity: 'Больше 0' },
      general: ['Тело запроса пустое'],
    })
  })
})

describe('mock по утверждённым правилам', () => {
  it('корпуса только A–D', () => {
    expect(BUILDINGS).toEqual(['A', 'B', 'C', 'D'])
    expect(SEED_ROOMS.every((r) => BUILDINGS.includes(r.building))).toBe(true)
  })

  it('отменённая бронь тоже запрещает удаление аудитории', async () => {
    let token: string | null = null
    const api = createMockGateway({
      storage: memoryStorage(),
      refreshStorage: memoryStorage(),
      getToken: () => token,
      latencyMs: 0,
      today: () => '2030-01-10',
    })
    token = (await api.login('admin', 'admin')).token
    const room = await api.adminCreateRoom({ name: 'D-999', building: 'D', floor: 9, capacity: 10, equipment: [] })
    token = (await api.login('student1', 'student1')).token
    const booking = await api.createBooking({ roomId: room.id, date: '2030-01-11', startTime: '10:00', endTime: '11:00' })
    await api.cancelBooking(booking.id)
    token = (await api.login('admin', 'admin')).token
    await expect(api.adminDeleteRoom(room.id)).rejects.toMatchObject({ status: 409, code: 'ROOM_HAS_BOOKINGS' })
  })

  it('refresh по «cookie» выдаёт новый access, logout её отзывает', async () => {
    const api = createMockGateway({ storage: memoryStorage(), refreshStorage: memoryStorage(), latencyMs: 0 })
    await api.login('student1', 'student1')
    await expect(api.refresh()).resolves.toMatchObject({ user: { login: 'student1' } })
    await api.logout()
    await expect(api.refresh()).rejects.toMatchObject({ status: 401 })
  })
})
