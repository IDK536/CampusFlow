import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AdminBookingFilters, Booking, Room, RoomInput } from '../../api/types'
import type { LoadStatus } from './roomsSlice'
import { loggedOut, loginSucceeded } from './authSlice'
import { todayISO } from '../../data/timeGrid'

export interface FormError {
  message: string
  fields: Record<string, string>
}

interface AdminState {
  bookings: Booking[]
  bookingsStatus: LoadStatus
  filters: AdminBookingFilters
  cancellingIds: number[]
  roomSave: { status: 'idle' | 'saving' | 'saved' | 'failed'; error: FormError | null }
  deletingRoomId: number | null
  stats: { bookings: Booking[]; status: LoadStatus }
}

/** По умолчанию «Все брони» открываются на сегодня. Дату берём в момент вызова, а не загрузки модуля. */
export const defaultAdminFilters = (): AdminBookingFilters => {
  const today = todayISO()
  return { dateFrom: today, dateTo: today, roomId: '', userId: '', status: '' }
}

const initialState = (): AdminState => ({
  bookings: [],
  bookingsStatus: 'idle',
  filters: defaultAdminFilters(),
  cancellingIds: [],
  roomSave: { status: 'idle', error: null },
  deletingRoomId: null,
  stats: { bookings: [], status: 'idle' },
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialState(),
  reducers: {
    adminBookingsRequested(state) {
      state.bookingsStatus = 'loading'
    },
    adminBookingsSucceeded(state, action: PayloadAction<Booking[]>) {
      state.bookingsStatus = 'succeeded'
      state.bookings = action.payload
    },
    adminBookingsFailed(state) {
      state.bookingsStatus = 'failed'
    },
    adminFiltersChanged(state, action: PayloadAction<Partial<AdminBookingFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    adminFiltersReset(state) {
      state.filters = defaultAdminFilters()
    },
    adminCancelRequested(state, action: PayloadAction<number>) {
      state.cancellingIds.push(action.payload)
    },
    adminCancelSucceeded(state, action: PayloadAction<number>) {
      state.cancellingIds = state.cancellingIds.filter((id) => id !== action.payload)
      for (const list of [state.bookings, state.stats.bookings]) {
        const booking = list.find((b) => b.id === action.payload)
        if (booking) booking.status = 'cancelled'
      }
    },
    adminCancelFailed(state, action: PayloadAction<number>) {
      state.cancellingIds = state.cancellingIds.filter((id) => id !== action.payload)
    },
    roomSaveRequested(state, _action: PayloadAction<{ id: number | null; input: RoomInput }>) {
      state.roomSave = { status: 'saving', error: null }
    },
    roomSaveSucceeded(state, _action: PayloadAction<Room>) {
      state.roomSave = { status: 'saved', error: null }
    },
    roomSaveFailed(state, action: PayloadAction<FormError>) {
      state.roomSave = { status: 'failed', error: action.payload }
    },
    roomSaveReset(state) {
      state.roomSave = { status: 'idle', error: null }
    },
    roomDeleteRequested(state, action: PayloadAction<number>) {
      state.deletingRoomId = action.payload
    },
    roomDeleteFinished(state) {
      state.deletingRoomId = null
    },
    statsRequested(state) {
      state.stats.status = 'loading'
    },
    statsSucceeded(state, action: PayloadAction<Booking[]>) {
      state.stats = { bookings: action.payload, status: 'succeeded' }
    },
    statsFailed(state) {
      state.stats.status = 'failed'
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loggedOut, () => initialState())
    builder.addCase(loginSucceeded, () => initialState())
  },
})

export const {
  adminBookingsRequested,
  adminBookingsSucceeded,
  adminBookingsFailed,
  adminFiltersChanged,
  adminFiltersReset,
  adminCancelRequested,
  adminCancelSucceeded,
  adminCancelFailed,
  roomSaveRequested,
  roomSaveSucceeded,
  roomSaveFailed,
  roomSaveReset,
  roomDeleteRequested,
  roomDeleteFinished,
  statsRequested,
  statsSucceeded,
  statsFailed,
} = adminSlice.actions
export default adminSlice.reducer
