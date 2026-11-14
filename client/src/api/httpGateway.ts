import type {
  AdminBookingFilters,
  Booking,
  BookingInput,
  CancelResponse,
  FreeSlots,
  Gateway,
  LoginResponse,
  Room,
  RoomFilters,
  RoomInput,
  RoomSearchQuery,
  RoomWithSlots,
} from './types'
import { http, isApiError } from './api'
import { fitsInFreeSlots } from './bookingRules'
import { inPeriod } from './period'

/**
 * Пути — из раздаточного материала (раздел 3).
 * Два маршрута ещё не согласованы с backend и вынесены в константы:
 *  - SEARCH_PATH — поиск свободных аудиторий одним запросом (FRONTEND_DECISIONS, п. 3);
 *  - удаление аудитории DELETE /admin/rooms/{id} (FRONTEND_DECISIONS, п. 1).
 */
export const SEARCH_PATH = '/rooms/search'
const roomPath = (id: number) => `/admin/rooms/${id}`

const roomParams = (filters: RoomFilters = {}) => ({
  building: filters.building || undefined,
  minCapacity: filters.minCapacity || undefined,
  equipment: filters.equipment?.length ? filters.equipment.join(',') : undefined,
})

const clean = <T extends object>(params: T) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null))

const getRooms = async (filters?: RoomFilters) => (await http.get<Room[]>('/rooms', { params: roomParams(filters) })).data

const getFreeSlots = async (roomId: number, date: string) =>
  (await http.get<FreeSlots>(`/rooms/${roomId}/free-slots`, { params: { date } })).data

/**
 * Запасной путь, пока на backend нет объединённого поиска: список аудиторий + free-slots по каждой.
 * Срабатывает только если SEARCH_PATH отвечает 404/405 без кода ROOM_NOT_FOUND.
 */
const searchFallback = async (query: RoomSearchQuery): Promise<RoomWithSlots[]> => {
  const rooms = await getRooms(query)
  const withSlots = await Promise.all(
    rooms.map(async (room) => ({ ...room, freeSlots: (await getFreeSlots(room.id, query.date)).freeSlots })),
  )
  const { startTime, endTime } = query
  return startTime && endTime ? withSlots.filter((r) => fitsInFreeSlots(r.freeSlots, { startTime, endTime })) : withSlots
}

export const httpGateway: Gateway = {
  login: async (login, password) => (await http.post<LoginResponse>('/auth/login', { login, password })).data,

  getRooms,

  getRoom: async (id) => (await http.get<Room>(`/rooms/${id}`)).data,

  getFreeSlots,

  searchRooms: async (query) => {
    try {
      const params = clean({ ...roomParams(query), date: query.date, startTime: query.startTime, endTime: query.endTime })
      return (await http.get<RoomWithSlots[]>(SEARCH_PATH, { params })).data
    } catch (e) {
      if (isApiError(e) && (e.status === 404 || e.status === 405) && e.code !== 'ROOM_NOT_FOUND') {
        return searchFallback(query)
      }
      throw e
    }
  },

  createBooking: async (input: BookingInput) => (await http.post<Booking>('/bookings', input)).data,

  getMyBookings: async (status) =>
    (await http.get<Booking[]>('/bookings/my', { params: clean({ status }) })).data,

  cancelBooking: async (id) => (await http.delete<CancelResponse>(`/bookings/${id}`)).data,

  // Контракт API знает только `date` (один день). Период отдаём как date, если он из одного дня,
  // а dateFrom/dateTo — на вырост; в любом случае дорезаем по периоду на клиенте.
  adminGetBookings: async ({ dateFrom, dateTo, ...rest }: AdminBookingFilters = {}) => {
    const single = dateFrom && dateFrom === dateTo ? dateFrom : undefined
    const params = clean({ ...rest, date: single, dateFrom: single ? undefined : dateFrom, dateTo: single ? undefined : dateTo })
    const items = (await http.get<Booking[]>('/admin/bookings', { params })).data
    return items.filter((b) => inPeriod(b.date, { dateFrom, dateTo }))
  },

  adminCancelBooking: async (id) => (await http.delete<CancelResponse>(`/admin/bookings/${id}`)).data,

  adminCreateRoom: async (input: RoomInput) => (await http.post<Room>('/admin/rooms', input)).data,

  adminUpdateRoom: async (id, input) => (await http.put<Room>(roomPath(id), input)).data,

  adminDeleteRoom: async (id) => {
    await http.delete(roomPath(id))
  },
}
