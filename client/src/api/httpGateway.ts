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
  RoomSearchResponse,
} from './types'
import { http } from './api'
import { inPeriod } from './period'

/**
 * Пути — по Swagger бэкенда (baseURL = /api).
 * Поиск одним запросом — это GET /rooms с параметром date (и, при желании, парой startTime/endTime):
 * с date ответ — {date, rooms}, без date — массив Room. Отдельного /rooms/search нет.
 */
export const SEARCH_PATH = '/rooms'
const roomPath = (id: number) => `/admin/rooms/${id}`

const roomParams = (filters: RoomFilters = {}) => ({
  building: filters.building || undefined,
  minCapacity: filters.minCapacity || undefined,
  equipment: filters.equipment?.length ? filters.equipment.join(',') : undefined,
})

const clean = <T extends object>(params: T) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null))

const getRooms = async (filters?: RoomFilters) =>
  (await http.get<Room[]>('/rooms', { params: clean(roomParams(filters)) })).data

const getFreeSlots = async (roomId: number, date: string) =>
  (await http.get<FreeSlots>(`/rooms/${roomId}/free-slots`, { params: { date } })).data

export const httpGateway: Gateway = {
  login: async (login, password) => (await http.post<LoginResponse>('/auth/login', { login, password })).data,

  refresh: async () => (await http.post<LoginResponse>('/auth/refresh')).data,

  logout: async () => {
    await http.post('/auth/logout')
  },

  getRooms,

  getRoom: async (id) => (await http.get<Room>(`/rooms/${id}`)).data,

  getFreeSlots,

  searchRooms: async (query) => {
    // Время передаётся только парой и только вместе с датой.
    const interval = query.startTime && query.endTime ? { startTime: query.startTime, endTime: query.endTime } : {}
    const params = clean({ ...roomParams(query), date: query.date, ...interval })
    return (await http.get<RoomSearchResponse>(SEARCH_PATH, { params })).data.rooms
  },

  createBooking: async (input: BookingInput) => (await http.post<Booking>('/bookings', input)).data,

  getMyBookings: async (status) =>
    (await http.get<Booking[]>('/bookings/my', { params: clean({ status }) })).data,

  cancelBooking: async (id) => (await http.delete<CancelResponse>(`/bookings/${id}`)).data,

  // API фильтрует только по date, roomId, userId, status. Один день уходит как date;
  // период в несколько дней сервер не поддерживает — его отсекаем на клиенте.
  adminGetBookings: async ({ dateFrom, dateTo, ...rest }: AdminBookingFilters = {}) => {
    const single = dateFrom && dateFrom === dateTo ? dateFrom : undefined
    const params = clean({ ...rest, date: single })
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
