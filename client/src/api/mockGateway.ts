import type {
  AdminBookingFilters,
  Booking,
  BookingInput,
  BookingStatus,
  ErrorBody,
  Gateway,
  Room,
  RoomFilters,
  RoomInput,
  RoomSearchQuery,
  User,
} from './types'
import { ApiError } from './api'
import { inPeriod } from './period'
import { computeFreeSlots, findConflict, fitsInFreeSlots, validateBookingTimes } from './bookingRules'
import { createSeedDb, type MockDb } from './mockData'
import { createUnsignedJwt, decodeJwt, isTokenExpired } from './jwt'
import { type KeyValueStorage, localStore, readJSON, sessionStore, writeJSON } from './storage'
import { getAccessToken } from './session'
import { DATE_RE, todayISO } from '../data/timeGrid'
import { BUILDINGS, EQUIPMENT_KEYS } from '../data/equipment'

/**
 * «Бэкенд в браузере»: те же функции, что и HTTP-шлюз, те же коды и тексты ошибок.
 * Данные лежат в localStorage — общие для всех вкладок, поэтому конфликт 409 воспроизводится
 * из двух вкладок с разными пользователями.
 *
 * Refresh-cookie эмулируется записью «на стороне сервера» в sessionStorage вкладки: код приложения
 * её не читает, а только вызывает refresh/logout — как с настоящей HttpOnly-cookie.
 */

const DB_KEY = 'campusflow.mockdb.v1'
const REFRESH_KEY = 'campusflow.mock.refresh'
const TOKEN_TTL_SEC = 15 * 60

const fail = (status: number, body: ErrorBody): never => {
  throw new ApiError(status, body)
}
const validation = (message: string, details: Record<string, unknown> | null = null) =>
  fail(400, { code: 'VALIDATION_ERROR', message, details })
const forbidden = (message = 'Недостаточно прав для этого действия') => fail(403, { code: 'FORBIDDEN', message })
const roomNotFound = (id: number) =>
  fail(404, { code: 'ROOM_NOT_FOUND', message: 'Аудитория не найдена', details: { roomId: id } })
const bookingNotFound = (id: number) =>
  fail(404, { code: 'BOOKING_NOT_FOUND', message: 'Бронь не найдена', details: { bookingId: id } })

export interface MockOptions {
  storage?: KeyValueStorage
  getToken?: () => string | null
  latencyMs?: number
  today?: () => string
  /** Где mock хранит refresh-сессию (аналог HttpOnly-cookie). */
  refreshStorage?: KeyValueStorage
}

export const createMockGateway = (options: MockOptions = {}) => {
  const storage = options.storage ?? localStore
  const getToken = options.getToken ?? getAccessToken
  const refreshStorage = options.refreshStorage ?? sessionStore
  const latency = options.latencyMs ?? 220
  const today = options.today ?? todayISO

  const load = (): MockDb => {
    const db = readJSON<MockDb>(storage, DB_KEY)
    // Seed с относительными датами: если день сменился, пересоздаём, чтобы сценарии «на завтра» работали.
    if (!db || db.seededOn !== today()) {
      const fresh = createSeedDb(today())
      writeJSON(storage, DB_KEY, fresh)
      return fresh
    }
    return db
  }
  const save = (db: MockDb) => writeJSON(storage, DB_KEY, db)

  const respond = async <T>(fn: () => T): Promise<T> => {
    if (latency) await new Promise((r) => setTimeout(r, latency * (0.6 + Math.random() * 0.8)))
    // structuredClone: снаружи нельзя случайно изменить «базу».
    return structuredClone(fn())
  }

  const currentUser = (db: MockDb): User => {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
      return fail(401, { code: 'UNAUTHORIZED', message: 'Сессия истекла, войдите снова' })
    }
    const payload = decodeJwt(token)
    const user = db.users.find((u) => String(u.id) === String(payload?.sub))
    return user ?? fail(401, { code: 'UNAUTHORIZED', message: 'Требуется вход в систему' })
  }

  const requireAdmin = (db: MockDb): User => {
    const user = currentUser(db)
    if (user.role !== 'admin') forbidden('Действие доступно только администратору')
    return user
  }

  const filterRooms = (rooms: Room[], filters: RoomFilters = {}): Room[] => {
    const { building, minCapacity, equipment = [] } = filters
    if (building && !BUILDINGS.includes(building)) validation('Неизвестный корпус', { building })
    if (minCapacity !== undefined && minCapacity !== null && (!Number.isInteger(minCapacity) || minCapacity <= 0)) {
      validation('Вместимость должна быть целым числом больше 0', { minCapacity })
    }
    const unknown = equipment.filter((e) => !EQUIPMENT_KEYS.includes(e))
    if (unknown.length) validation('Неизвестное оборудование', { equipment: unknown })
    return rooms
      .filter((r) => !building || r.building === building)
      .filter((r) => !minCapacity || r.capacity >= minCapacity)
      .filter((r) => equipment.every((e) => r.equipment.includes(e)))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const freeSlotsOf = (db: MockDb, roomId: number, date: string) =>
    computeFreeSlots(db.bookings.filter((b) => b.roomId === roomId && b.date === date && b.status === 'active'))

  const checkDate = (date: string | undefined) => {
    if (!date || !DATE_RE.test(date)) validation('Дата должна быть в формате ГГГГ-ММ-ДД', { date })
    if (date! < today()) validation('Нельзя смотреть слоты на прошедшую дату', { date })
  }

  const validateRoom = (db: MockDb, input: RoomInput, ignoreId?: number): RoomInput => {
    const name = (input.name ?? '').trim()
    // Как в API: details — {поле: string[]}.
    const errors: Record<string, string[]> = {}
    const add = (field: string, message: string) => (errors[field] ??= []).push(message)
    if (!name) add('name', 'Укажите название')
    else if (db.rooms.some((r) => r.id !== ignoreId && r.name.toLowerCase() === name.toLowerCase())) {
      add('name', 'Аудитория с таким названием уже существует')
    }
    if (!BUILDINGS.includes(input.building)) add('building', `Корпус — один из ${BUILDINGS.join(', ')}`)
    if (!Number.isInteger(input.floor) || input.floor < 1) add('floor', 'Этаж — целое число от 1')
    if (!Number.isInteger(input.capacity) || input.capacity <= 0) add('capacity', 'Вместимость — целое число больше 0')
    if (!Array.isArray(input.equipment) || input.equipment.some((e) => !EQUIPMENT_KEYS.includes(e))) {
      add('equipment', 'Неизвестное оборудование')
    }
    if (Object.keys(errors).length) validation('Некорректные данные запроса', errors)
    return {
      name,
      building: input.building,
      floor: input.floor,
      capacity: input.capacity,
      equipment: EQUIPMENT_KEYS.filter((e) => input.equipment.includes(e)),
    }
  }

  const cancel = (db: MockDb, id: number, asAdmin: boolean) => {
    const user = asAdmin ? requireAdmin(db) : currentUser(db)
    const booking = db.bookings.find((b) => b.id === id) ?? bookingNotFound(id)
    if (!asAdmin && booking.userId !== user.id) forbidden('Нельзя отменить чужую бронь')
    if (booking.status === 'cancelled') {
      fail(409, { code: 'ALREADY_CANCELLED', message: 'Бронь уже отменена', details: { bookingId: id } })
    }
    booking.status = 'cancelled'
    save(db)
    return { id, status: 'cancelled' as const }
  }

  const issue = (user: User) => {
    const now = Math.floor(Date.now() / 1000)
    const token = createUnsignedJwt({ sub: user.id, login: user.login, role: user.role, iat: now, exp: now + TOKEN_TTL_SEC })
    return { token, user }
  }

  const gateway: Gateway & { resetDemoData(): void } = {
    login: (login, password) =>
      respond(() => {
        const db = load()
        const user = db.users.find((u) => u.login === login.trim())
        if (!user || password !== user.login) {
          fail(401, { code: 'UNAUTHORIZED', message: 'Неверный логин или пароль' })
        }
        writeJSON(refreshStorage, REFRESH_KEY, { userId: user!.id })
        return issue(user!)
      }),

    refresh: () =>
      respond(() => {
        const db = load()
        const record = readJSON<{ userId: number }>(refreshStorage, REFRESH_KEY)
        const user = record && db.users.find((u) => u.id === record.userId)
        if (!user) {
          refreshStorage.removeItem(REFRESH_KEY)
          return fail(401, { code: 'UNAUTHORIZED', message: 'Сессия истекла, войдите снова' })
        }
        return issue(user)
      }),

    logout: () =>
      respond(() => {
        refreshStorage.removeItem(REFRESH_KEY)
      }),

    getRooms: (filters) => respond(() => filterRooms(load().rooms, filters)),

    getRoom: (id) => respond(() => load().rooms.find((r) => r.id === id) ?? roomNotFound(id)),

    getFreeSlots: (roomId, date) =>
      respond(() => {
        const db = load()
        if (!db.rooms.some((r) => r.id === roomId)) roomNotFound(roomId)
        checkDate(date)
        return { roomId, date, freeSlots: freeSlotsOf(db, roomId, date) }
      }),

    searchRooms: (query: RoomSearchQuery) =>
      respond(() => {
        const db = load()
        checkDate(query.date)
        const { startTime, endTime } = query
        const hasInterval = Boolean(startTime && endTime)
        if (hasInterval) {
          const error = validateBookingTimes({ date: query.date, startTime, endTime }, today())
          if (error) validation(error, { startTime, endTime })
        }
        return filterRooms(db.rooms, query)
          .map((room) => ({ ...room, freeSlots: freeSlotsOf(db, room.id, query.date) }))
          .filter((room) => !hasInterval || fitsInFreeSlots(room.freeSlots, { startTime: startTime!, endTime: endTime! }))
      }),

    createBooking: (input: BookingInput) =>
      respond(() => {
        const db = load()
        const user = currentUser(db)
        if (user.role !== 'student') forbidden('Администратор не создаёт брони')
        const room = db.rooms.find((r) => r.id === input.roomId) ?? roomNotFound(input.roomId)
        const error = validateBookingTimes(input, today())
        if (error) validation(error, { date: input.date, startTime: input.startTime, endTime: input.endTime })
        const comment = (input.comment ?? '').trim()
        if (comment.length > 500) validation('Комментарий — не длиннее 500 символов')
        const conflict = findConflict(db.bookings, input)
        if (conflict) {
          fail(409, {
            code: 'BOOKING_CONFLICT',
            message: 'Аудитория уже забронирована на это время',
            details: { roomId: room.id, date: conflict.date, startTime: conflict.startTime, endTime: conflict.endTime },
          })
        }
        const booking: Booking = {
          id: db.nextBookingId++,
          roomId: room.id,
          roomName: room.name,
          userId: user.id,
          userDisplayName: user.displayName,
          date: input.date,
          startTime: input.startTime,
          endTime: input.endTime,
          status: 'active',
          comment: comment || null,
        }
        db.bookings.push(booking)
        save(db)
        return booking
      }),

    getMyBookings: (status?: BookingStatus | '') =>
      respond(() => {
        const db = load()
        const user = currentUser(db)
        return db.bookings.filter((b) => b.userId === user.id && (!status || b.status === status))
      }),

    cancelBooking: (id) => respond(() => cancel(load(), id, false)),

    adminGetBookings: (filters: AdminBookingFilters = {}) =>
      respond(() => {
        const db = load()
        requireAdmin(db)
        return db.bookings.filter(
          (b) =>
            inPeriod(b.date, filters) &&
            (!filters.roomId || b.roomId === Number(filters.roomId)) &&
            (!filters.userId || b.userId === Number(filters.userId)) &&
            (!filters.status || b.status === filters.status),
        )
      }),

    adminCancelBooking: (id) => respond(() => cancel(load(), id, true)),

    adminCreateRoom: (input) =>
      respond(() => {
        const db = load()
        requireAdmin(db)
        const room: Room = { id: db.nextRoomId++, ...validateRoom(db, input) }
        db.rooms.push(room)
        save(db)
        return room
      }),

    adminUpdateRoom: (id, input) =>
      respond(() => {
        const db = load()
        requireAdmin(db)
        const index = db.rooms.findIndex((r) => r.id === id)
        if (index < 0) roomNotFound(id)
        const room: Room = { id, ...validateRoom(db, input, id) }
        db.rooms[index] = room
        // roomName денормализован в броне — обновляем, чтобы списки не показывали старое название.
        db.bookings.forEach((b) => b.roomId === id && (b.roomName = room.name))
        save(db)
        return room
      }),

    // DELETE /admin/rooms/{id}: как в API, любая связанная бронь — активная или отменённая,
    // прошедшая или будущая — запрещает удаление (409 ROOM_HAS_BOOKINGS). Отмена броней не помогает.
    adminDeleteRoom: (id) =>
      respond(() => {
        const db = load()
        requireAdmin(db)
        if (!db.rooms.some((r) => r.id === id)) roomNotFound(id)
        if (db.bookings.some((b) => b.roomId === id)) {
          fail(409, {
            code: 'ROOM_HAS_BOOKINGS',
            message: 'Аудиторию нельзя удалить: с ней связаны брони',
            details: { roomId: id },
          })
        }
        db.rooms = db.rooms.filter((r) => r.id !== id)
        save(db)
      }),

    resetDemoData: () => writeJSON(storage, DB_KEY, createSeedDb(today())),
  }

  return gateway
}

export const mockGateway = createMockGateway()
