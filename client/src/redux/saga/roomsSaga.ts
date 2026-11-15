import { call, debounce, put, select, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gateway } from '../../api/gateway'
import type { FreeSlots, Room, RoomSearchQuery, RoomWithSlots } from '../../api/types'
import { earliestWindow, recommendRooms, type RecommendParams } from '../../data/recommend'
import { nowMinutes, toMinutes, todayISO } from '../../data/timeGrid'
import {
  catalogFailed,
  catalogRequested,
  catalogSucceeded,
  recommendFailed,
  recommendRequested,
  recommendSucceeded,
  searchFailed,
  searchRequested,
  searchSucceeded,
  type SearchFilters,
} from '../slices/roomsSlice'
import { slotsFailed, slotsRequested, slotsSucceeded } from '../slices/slotsSlice'
import { errorMessage, reportError } from './errors'
import type { RootState } from '../store'

export const toSearchQuery = (f: SearchFilters): RoomSearchQuery => ({
  date: f.date,
  building: f.building,
  minCapacity: f.minCapacity,
  equipment: f.equipment,
  ...(f.timeMode === 'exact' ? { startTime: f.startTime, endTime: f.endTime } : {}),
})

/** Режим «в промежутке»: оставляем аудитории, где есть окно нужной длины внутри промежутка. */
export const filterFlexible = (rooms: RoomWithSlots[], f: SearchFilters, notBefore = 0): RoomWithSlots[] => {
  if (f.timeMode !== 'flexible') return rooms
  const from = Math.max(toMinutes(f.startTime), notBefore)
  return rooms.filter((r) => earliestWindow(r.freeSlots, f.durationMin, from, toMinutes(f.endTime)) !== null)
}

function* search(): SagaIterator {
  const filters: SearchFilters = yield select((s: RootState) => s.rooms.filters)
  try {
    const rooms: RoomWithSlots[] = yield call(gateway.searchRooms, toSearchQuery(filters))
    const notBefore = filters.date === todayISO() ? nowMinutes() : 0
    yield put(searchSucceeded(filterFlexible(rooms, filters, notBefore)))
  } catch (error) {
    yield put(searchFailed(errorMessage(error)))
    yield call(reportError, error, 'Не удалось найти аудитории')
  }
}

function* loadCatalog(): SagaIterator {
  try {
    const rooms: Room[] = yield call(gateway.getRooms, {})
    yield put(catalogSucceeded(rooms))
  } catch (error) {
    yield put(catalogFailed())
    yield call(reportError, error, 'Не удалось загрузить аудитории')
  }
}

function* loadSlots(action: PayloadAction<{ roomId: number; date: string }>): SagaIterator {
  try {
    const result: FreeSlots = yield call(gateway.getFreeSlots, action.payload.roomId, action.payload.date)
    yield put(slotsSucceeded({ roomId: action.payload.roomId, date: action.payload.date, freeSlots: result.freeSlots }))
  } catch (error) {
    yield put(slotsFailed(errorMessage(error)))
    yield call(reportError, error, 'Не удалось загрузить свободные слоты')
  }
}

function* recommend(action: PayloadAction<RecommendParams>): SagaIterator {
  const date: string = yield select((s: RootState) => s.rooms.filters.date)
  const params = action.payload
  try {
    const rooms: RoomWithSlots[] = yield call(gateway.searchRooms, {
      date,
      minCapacity: params.people,
      equipment: params.equipment,
    })
    const notBefore = date === todayISO() ? nowMinutes() : 0
    yield put(recommendSucceeded(recommendRooms(rooms, params, { notBefore })))
  } catch (error) {
    yield put(recommendFailed())
    yield call(reportError, error, 'Не удалось подобрать аудитории')
  }
}

export function* roomsSaga(): SagaIterator {
  // debounce: поле «мест от» не шлёт запрос на каждую цифру.
  yield debounce(250, searchRequested.type, search)
  yield takeLatest(catalogRequested.type, loadCatalog)
  yield takeLatest(slotsRequested.type, loadSlots)
  yield takeLatest(recommendRequested.type, recommend)
}
