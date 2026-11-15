import { beforeEach, describe, expect, it } from 'vitest'
import { createMockGateway } from './mockGateway'
import { SEED_ROOMS } from './mockData'
import type { ApiError } from './api'
import type { KeyValueStorage } from './storage'
import { addDaysISO } from '../data/timeGrid'

/** Сценарии приёмки 1–7 на seed-данных против mock-бэкенда. */
const TODAY = '2030-01-10'
const TOMORROW = addDaysISO(TODAY, 1)

const memoryStorage = (): KeyValueStorage => {
  const map = new Map<string, string>()
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) }
}

const setup = () => {
  let token: string | null = null
  const api = createMockGateway({ storage: memoryStorage(), getToken: () => token, latencyMs: 0, today: () => TODAY })
  const loginAs = async (login: string) => {
    token = (await api.login(login, login)).token
  }
  return { api, loginAs }
}

const rejection = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise
  } catch (e) {
    return e as ApiError
  }
  throw new Error('ожидалась ошибка')
}

describe('mock-бэкенд: сценарии приёмки', () => {
  let ctx: ReturnType<typeof setup>
  beforeEach(() => {
    ctx = setup()
  })

  it('логин: пароль = логин, иначе 401', async () => {
    await expect(ctx.api.login('student1', 'student1')).resolves.toMatchObject({ user: { id: 1, role: 'student' } })
    expect((await rejection(ctx.api.login('student1', 'wrong'))).status).toBe(401)
  })

  it('1. фильтр B / 20 мест / проектор → только B-101 и B-204', async () => {
    const rooms = await ctx.api.getRooms({ building: 'B', minCapacity: 20, equipment: ['projector'] })
    expect(rooms.map((r) => r.name)).toEqual(['B-101', 'B-204'])
  })

  it('фильтр с неизвестным оборудованием → 400', async () => {
    const error = await rejection(ctx.api.getRooms({ equipment: ['laser' as never] }))
    expect([error.status, error.code]).toEqual([400, 'VALIDATION_ERROR'])
  })

  it('2. свободные слоты B-101 на завтра: 09:00–10:30 занято, 14:00–15:00 свободно', async () => {
    const { freeSlots } = await ctx.api.getFreeSlots(4, TOMORROW)
    expect(freeSlots).toEqual([{ startTime: '10:30', endTime: '18:00' }])
  })

  it('3–7: бронь, конфликт, чужая отмена, своя отмена, админ', async () => {
    await ctx.loginAs('student1')
    const created = await ctx.api.createBooking({ roomId: 4, date: TOMORROW, startTime: '14:00', endTime: '15:00', comment: '' })
    expect(created).toMatchObject({ roomName: 'B-101', userId: 1, status: 'active' })
    expect((await ctx.api.getMyBookings()).some((b) => b.id === created.id)).toBe(true)

    // 4. student2 на тот же интервал → 409
    await ctx.loginAs('student2')
    const conflict = await rejection(
      ctx.api.createBooking({ roomId: 4, date: TOMORROW, startTime: '14:30', endTime: '15:30', comment: '' }),
    )
    expect([conflict.status, conflict.code]).toEqual([409, 'BOOKING_CONFLICT'])
    expect(conflict.details).toMatchObject({ startTime: '14:00', endTime: '15:00' })

    // касание границы — не конфликт
    const adjacent = await ctx.api.createBooking({ roomId: 4, date: TOMORROW, startTime: '15:00', endTime: '16:00', comment: '' })
    expect(adjacent.status).toBe('active')

    // 6. student2 отменяет чужую → 403, бронь осталась активной
    const forbidden = await rejection(ctx.api.cancelBooking(created.id))
    expect([forbidden.status, forbidden.code]).toEqual([403, 'FORBIDDEN'])

    // student2 не может в admin-endpoint
    expect((await rejection(ctx.api.adminGetBookings())).status).toBe(403)

    // 5. student1 отменяет свою → слот снова свободен
    await ctx.loginAs('student1')
    await expect(ctx.api.cancelBooking(created.id)).resolves.toEqual({ id: created.id, status: 'cancelled' })
    expect((await rejection(ctx.api.cancelBooking(created.id))).code).toBe('ALREADY_CANCELLED')
    const { freeSlots } = await ctx.api.getFreeSlots(4, TOMORROW)
    expect(freeSlots).toContainEqual({ startTime: '10:30', endTime: '15:00' })

    // 7. admin видит все брони и отменяет бронь student2
    await ctx.loginAs('admin')
    const all = await ctx.api.adminGetBookings()
    expect(all.length).toBeGreaterThan(7)
    await expect(ctx.api.adminCancelBooking(adjacent.id)).resolves.toMatchObject({ status: 'cancelled' })
  })

  it('администратор не создаёт брони → 403', async () => {
    await ctx.loginAs('admin')
    const error = await rejection(
      ctx.api.createBooking({ roomId: 2, date: TOMORROW, startTime: '10:00', endTime: '11:00', comment: '' }),
    )
    expect(error.status).toBe(403)
  })

  it('валидация брони: прошлое, не кратно 30, вне дня → 400', async () => {
    await ctx.loginAs('student1')
    const cases = [
      { date: addDaysISO(TODAY, -1), startTime: '10:00', endTime: '11:00' },
      { date: TOMORROW, startTime: '10:15', endTime: '11:00' },
      { date: TOMORROW, startTime: '17:30', endTime: '18:30' },
      { date: TOMORROW, startTime: '12:00', endTime: '11:00' },
    ]
    for (const c of cases) {
      expect((await rejection(ctx.api.createBooking({ roomId: 2, comment: '', ...c }))).status).toBe(400)
    }
  })

  it('поиск одним запросом: только свободные на весь интервал', async () => {
    const rooms = await ctx.api.searchRooms({ date: TOMORROW, startTime: '10:00', endTime: '11:00' })
    const names = rooms.map((r) => r.name)
    expect(names).not.toContain('A-101') // занята 10:00–11:30
    expect(names).not.toContain('B-101') // занята 09:00–10:30
    expect(names).toContain('A-102')
  })

  it('CRUD аудиторий: уникальное имя, удаление с активными бронями запрещено', async () => {
    await ctx.loginAs('admin')
    const room = await ctx.api.adminCreateRoom({ name: 'D-404', building: 'D', floor: 4, capacity: 16, equipment: ['audio'] })
    // id новой аудитории — следующий после seed (база расширена, поэтому не 13, как в seed из ТЗ).
    expect(room.id).toBe(SEED_ROOMS.length + 1)
    expect((await rejection(ctx.api.adminCreateRoom({ ...room, name: 'a-101' }))).code).toBe('VALIDATION_ERROR')
    await expect(ctx.api.adminUpdateRoom(room.id, { ...room, capacity: 20 })).resolves.toMatchObject({ capacity: 20 })
    expect((await rejection(ctx.api.adminDeleteRoom(4))).code).toBe('ROOM_HAS_BOOKINGS')
    await ctx.api.adminDeleteRoom(room.id)
    expect((await rejection(ctx.api.getRoom(room.id))).code).toBe('ROOM_NOT_FOUND')
  })
})
