import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Building, Equipment, Room, RoomWithSlots } from '../../api/types'
import type { RecommendParams, Recommendation } from '../../data/recommend'
import { todayISO } from '../../data/timeGrid'
import { loggedOut, loginSucceeded } from './authSlice'

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type RoomsView = 'map' | 'list' | 'pick'

export interface SearchFilters {
  date: string
  building: Building | ''
  minCapacity: number | null
  equipment: Equipment[]
  /**
   * Время: any — не важно; exact — свободна всё время startTime–endTime;
   * flexible — есть окно durationMin минут где-то между startTime и endTime.
   */
  timeMode: 'any' | 'exact' | 'flexible'
  startTime: string
  endTime: string
  durationMin: number
}

interface RoomsState {
  filters: SearchFilters
  results: RoomWithSlots[]
  status: LoadStatus
  error: string | null
  catalog: Room[]
  catalogStatus: LoadStatus
  view: RoomsView
  selectedRoomId: number | null
  recommendParams: RecommendParams
  recommendations: Recommendation[]
  recommendStatus: LoadStatus
}

export const defaultFilters = (): SearchFilters => ({
  date: todayISO(),
  building: '',
  minCapacity: null,
  equipment: [],
  timeMode: 'any',
  startTime: '09:00',
  endTime: '18:00',
  durationMin: 60,
})

const initialState: RoomsState = {
  filters: defaultFilters(),
  results: [],
  status: 'idle',
  error: null,
  catalog: [],
  catalogStatus: 'idle',
  view: 'map',
  selectedRoomId: null,
  recommendParams: {
    people: 20,
    timeMode: 'exact',
    durationMin: 60,
    windowStart: '09:00',
    windowEnd: '18:00',
    equipment: [],
    building: '',
    floor: null,
  },
  recommendations: [],
  recommendStatus: 'idle',
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    filtersChanged(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    filtersReset(state) {
      state.filters = { ...defaultFilters(), date: state.filters.date }
    },
    searchRequested(state) {
      state.status = 'loading'
      state.error = null
    },
    searchSucceeded(state, action: PayloadAction<RoomWithSlots[]>) {
      state.status = 'succeeded'
      state.results = action.payload
    },
    searchFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
      state.results = []
    },
    catalogRequested(state) {
      state.catalogStatus = 'loading'
    },
    catalogSucceeded(state, action: PayloadAction<Room[]>) {
      state.catalogStatus = 'succeeded'
      state.catalog = action.payload
    },
    catalogFailed(state) {
      state.catalogStatus = 'failed'
    },
    viewChanged(state, action: PayloadAction<RoomsView>) {
      state.view = action.payload
    },
    roomSelected(state, action: PayloadAction<number | null>) {
      state.selectedRoomId = action.payload
    },
    recommendRequested(state, action: PayloadAction<RecommendParams>) {
      state.recommendParams = action.payload
      state.recommendStatus = 'loading'
    },
    recommendSucceeded(state, action: PayloadAction<Recommendation[]>) {
      state.recommendStatus = 'succeeded'
      state.recommendations = action.payload
    },
    recommendFailed(state) {
      state.recommendStatus = 'failed'
      state.recommendations = []
    },
  },
  extraReducers: (builder) => {
    const resetSelection = (state: RoomsState) => {
      state.selectedRoomId = null
      state.recommendations = []
      state.recommendStatus = 'idle'
    }
    builder.addCase(loggedOut, resetSelection)
    builder.addCase(loginSucceeded, resetSelection)
  },
})

export const {
  filtersChanged,
  filtersReset,
  searchRequested,
  searchSucceeded,
  searchFailed,
  catalogRequested,
  catalogSucceeded,
  catalogFailed,
  viewChanged,
  roomSelected,
  recommendRequested,
  recommendSucceeded,
  recommendFailed,
} = roomsSlice.actions
export default roomsSlice.reducer
