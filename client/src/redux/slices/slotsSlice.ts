import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Booking, TimeInterval } from '../../api/types'
import type { LoadStatus } from './roomsSlice'
import { loggedOut, loginSucceeded } from './authSlice'

interface SlotsState {
  roomId: number | null
  date: string | null
  freeSlots: TimeInterval[]
  status: LoadStatus
  error: string | null
  selection: TimeInterval | null
  comment: string
  bookingStatus: 'idle' | 'saving'
  /** Интервал, из-за которого backend вернул 409, — подсвечиваем в таймлайне. */
  conflict: TimeInterval | null
  /** Счётчик для перезапуска анимации «тряски» при повторном конфликте. */
  conflictTick: number
  lastBooking: Booking | null
}

const initialState: SlotsState = {
  roomId: null,
  date: null,
  freeSlots: [],
  status: 'idle',
  error: null,
  selection: null,
  comment: '',
  bookingStatus: 'idle',
  conflict: null,
  conflictTick: 0,
  lastBooking: null,
}

const slotsSlice = createSlice({
  name: 'slots',
  initialState,
  reducers: {
    slotsRequested(state, action: PayloadAction<{ roomId: number; date: string; keepSelection?: boolean }>) {
      const { roomId, date, keepSelection } = action.payload
      const sameTarget = state.roomId === roomId && state.date === date
      if (!sameTarget) {
        state.freeSlots = []
        if (!keepSelection) state.selection = null
        state.conflict = null
      }
      state.roomId = roomId
      state.date = date
      state.status = 'loading'
      state.error = null
    },
    slotsSucceeded(state, action: PayloadAction<{ roomId: number; date: string; freeSlots: TimeInterval[] }>) {
      if (action.payload.roomId !== state.roomId || action.payload.date !== state.date) return
      state.freeSlots = action.payload.freeSlots
      state.status = 'succeeded'
    },
    slotsFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
    slotsCleared() {
      return initialState
    },
    selectionChanged(state, action: PayloadAction<TimeInterval | null>) {
      state.selection = action.payload
      state.conflict = null
    },
    commentChanged(state, action: PayloadAction<string>) {
      state.comment = action.payload
    },
    bookingRequested(state) {
      state.bookingStatus = 'saving'
      state.conflict = null
    },
    bookingSucceeded(state, action: PayloadAction<Booking>) {
      state.bookingStatus = 'idle'
      state.lastBooking = action.payload
      state.selection = null
      state.comment = ''
    },
    bookingFailed(state) {
      state.bookingStatus = 'idle'
    },
    conflictDetected(state, action: PayloadAction<TimeInterval | null>) {
      state.bookingStatus = 'idle'
      state.conflict = action.payload ?? state.selection
      state.conflictTick += 1
    },
    ticketClosed(state) {
      state.lastBooking = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loggedOut, () => initialState)
    builder.addCase(loginSucceeded, () => initialState)
  },
})

export const {
  slotsRequested,
  slotsSucceeded,
  slotsFailed,
  slotsCleared,
  selectionChanged,
  commentChanged,
  bookingRequested,
  bookingSucceeded,
  bookingFailed,
  conflictDetected,
  ticketClosed,
} = slotsSlice.actions
export default slotsSlice.reducer
