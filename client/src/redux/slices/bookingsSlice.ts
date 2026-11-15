import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Booking, BookingStatus } from '../../api/types'
import type { LoadStatus } from './roomsSlice'
import { loggedOut, loginSucceeded } from './authSlice'

interface BookingsState {
  items: Booking[]
  status: LoadStatus
  error: string | null
  statusFilter: BookingStatus | ''
  cancellingIds: number[]
  /** Только что отменённые — для короткой анимации смены статуса. */
  justCancelledIds: number[]
}

const initialState: BookingsState = {
  items: [],
  status: 'idle',
  error: null,
  statusFilter: '',
  cancellingIds: [],
  justCancelledIds: [],
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    myBookingsRequested(state) {
      state.status = 'loading'
      state.error = null
    },
    myBookingsSucceeded(state, action: PayloadAction<Booking[]>) {
      state.status = 'succeeded'
      state.items = action.payload
    },
    myBookingsFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
    statusFilterChanged(state, action: PayloadAction<BookingStatus | ''>) {
      state.statusFilter = action.payload
    },
    cancelRequested(state, action: PayloadAction<number>) {
      state.cancellingIds.push(action.payload)
    },
    cancelSucceeded(state, action: PayloadAction<number>) {
      state.cancellingIds = state.cancellingIds.filter((id) => id !== action.payload)
      state.justCancelledIds.push(action.payload)
      const booking = state.items.find((b) => b.id === action.payload)
      if (booking) booking.status = 'cancelled'
    },
    cancelFailed(state, action: PayloadAction<number>) {
      state.cancellingIds = state.cancellingIds.filter((id) => id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loggedOut, () => initialState)
    builder.addCase(loginSucceeded, () => initialState)
  },
})

export const {
  myBookingsRequested,
  myBookingsSucceeded,
  myBookingsFailed,
  statusFilterChanged,
  cancelRequested,
  cancelSucceeded,
  cancelFailed,
} = bookingsSlice.actions
export default bookingsSlice.reducer
