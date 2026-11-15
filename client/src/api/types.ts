export type Role = 'student' | 'admin'
/** ТЗ (DOCX) разрешает только корпуса A–D; API отклоняет остальные с 400. */
export type Building = 'A' | 'B' | 'C' | 'D'
export type Equipment = 'projector' | 'whiteboard' | 'computers' | 'audio' | 'video'
export type BookingStatus = 'active' | 'cancelled'

export interface User {
  id: number
  login: string
  displayName: string
  role: Role
}

export interface Room {
  id: number
  name: string
  building: Building
  floor: number
  capacity: number
  equipment: Equipment[]
}

export type RoomInput = Omit<Room, 'id'>

export interface TimeInterval {
  startTime: string
  endTime: string
}

export interface FreeSlots {
  roomId: number
  date: string
  freeSlots: TimeInterval[]
}

/** Аудитория из ответа объединённого поиска: сама аудитория + её свободные интервалы на дату. */
export interface RoomWithSlots extends Room {
  freeSlots: TimeInterval[]
}

export interface Booking {
  id: number
  roomId: number
  roomName: string
  userId: number
  userDisplayName: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  /** API может вернуть null, если комментарий не задан. */
  comment: string | null
}

export interface BookingInput {
  roomId: number
  date: string
  startTime: string
  endTime: string
  /** Необязателен в запросе. */
  comment?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CancelResponse {
  id: number
  status: 'cancelled'
}

export interface RoomFilters {
  building?: Building | ''
  minCapacity?: number | null
  equipment?: Equipment[]
}

/** Параметры поиска свободных аудиторий одним запросом: GET /api/rooms с датой (и, при желании, интервалом). */
export interface RoomSearchQuery extends RoomFilters {
  date: string
  startTime?: string
  endTime?: string
}

/** Ответ GET /api/rooms при заданной date: оболочка с датой и аудиториями со свободными слотами. */
export interface RoomSearchResponse {
  date: string
  rooms: RoomWithSlots[]
}

export interface AdminBookingFilters {
  /**
   * Период включительно, ГГГГ-ММ-ДД. Пустая граница — без ограничения; один день — from === to.
   * API знает только `date`: один день уходит как date, период фильтруется на клиенте.
   */
  dateFrom?: string
  dateTo?: string
  roomId?: number | ''
  userId?: number | ''
  status?: BookingStatus | ''
}

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'ROOM_NOT_FOUND'
  | 'BOOKING_NOT_FOUND'
  | 'BOOKING_CONFLICT'
  | 'ALREADY_CANCELLED'
  | 'ROOM_HAS_BOOKINGS'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR'

export interface ErrorBody {
  code: ErrorCode | string
  message: string
  details?: Record<string, unknown> | null
}

export interface Gateway {
  login(login: string, password: string): Promise<LoginResponse>
  /** POST /api/auth/refresh — по HttpOnly refresh-cookie, действительный access не нужен. */
  refresh(): Promise<LoginResponse>
  /** POST /api/auth/logout — отзывает refresh-сессию и удаляет cookie, 204. */
  logout(): Promise<void>
  getRooms(filters?: RoomFilters): Promise<Room[]>
  getRoom(id: number): Promise<Room>
  getFreeSlots(roomId: number, date: string): Promise<FreeSlots>
  searchRooms(query: RoomSearchQuery): Promise<RoomWithSlots[]>
  createBooking(input: BookingInput): Promise<Booking>
  getMyBookings(status?: BookingStatus | ''): Promise<Booking[]>
  cancelBooking(id: number): Promise<CancelResponse>
  adminGetBookings(filters?: AdminBookingFilters): Promise<Booking[]>
  adminCancelBooking(id: number): Promise<CancelResponse>
  adminCreateRoom(input: RoomInput): Promise<Room>
  adminUpdateRoom(id: number, input: RoomInput): Promise<Room>
  adminDeleteRoom(id: number): Promise<void>
}
