import { call, debounce, put, select, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gateway } from '../../api/gateway'
import { isApiError } from '../../api/api'
import type { AdminBookingFilters, Booking, Room, RoomInput } from '../../api/types'
import {
  adminBookingsFailed,
  adminBookingsRequested,
  adminBookingsSucceeded,
  adminCancelFailed,
  adminCancelRequested,
  adminCancelSucceeded,
  adminFiltersChanged,
  adminFiltersReset,
  roomDeleteFinished,
  roomDeleteRequested,
  roomSaveFailed,
  roomSaveRequested,
  roomSaveSucceeded,
  statsFailed,
  statsRequested,
  statsSucceeded,
} from '../slices/adminSlice'
import { catalogRequested, searchRequested } from '../slices/roomsSlice'
import { pushToast } from '../slices/uiSlice'
import { errorMessage, reportError } from './errors'
import type { RootState } from '../store'

function* loadBookings(): SagaIterator {
  const filters: AdminBookingFilters = yield select((s: RootState) => s.admin.filters)
  try {
    const items: Booking[] = yield call(gateway.adminGetBookings, filters)
    yield put(adminBookingsSucceeded(items))
  } catch (error) {
    yield put(adminBookingsFailed())
    yield call(reportError, error, 'Не удалось загрузить брони')
  }
}

const FILTERS_DEBOUNCE_MS = 350

function* refetchBookings(): SagaIterator {
  yield put(adminBookingsRequested())
}

function* cancelBooking(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(gateway.adminCancelBooking, action.payload)
    yield put(adminCancelSucceeded(action.payload))
    yield put(pushToast({ kind: 'success', title: `Бронь #${action.payload} отменена` }))
    yield put(searchRequested())
  } catch (error) {
    yield put(adminCancelFailed(action.payload))
    yield call(reportError, error, 'Не удалось отменить бронь')
    if (isApiError(error) && error.code === 'ALREADY_CANCELLED') yield put(adminBookingsRequested())
  }
}

/** Поля формы аудитории, у которых есть место для сообщения об ошибке. */
const FORM_FIELDS = new Set(['name', 'building', 'floor', 'capacity', 'equipment'])

/**
 * details из 400 → ошибки полей. API присылает {поле: string[]}; строку тоже принимаем.
 * Ключ может быть JSON-путём ($.floor, $.equipment[0]) или с заглавной буквы (Floor) — приводим к имени поля.
 * Всё, что не относится к известному полю, уходит в общий список и показывается под формой.
 */
export const fieldErrors = (details: Record<string, unknown> | null) => {
  const fields: Record<string, string> = {}
  const general: string[] = []
  for (const [key, value] of Object.entries(details ?? {})) {
    const messages = (Array.isArray(value) ? value : [value]).filter((m): m is string => typeof m === 'string' && m !== '')
    if (!messages.length) continue
    const field = key.replace(/^\$\.?/, '').split(/[.[]/)[0]
    const name = field.charAt(0).toLowerCase() + field.slice(1)
    if (FORM_FIELDS.has(name)) fields[name] = [fields[name], ...messages].filter(Boolean).join('. ')
    else general.push(...messages)
  }
  return { fields, general }
}

function* saveRoom(action: PayloadAction<{ id: number | null; input: RoomInput }>): SagaIterator {
  const { id, input } = action.payload
  try {
    const room: Room = id ? yield call(gateway.adminUpdateRoom, id, input) : yield call(gateway.adminCreateRoom, input)
    yield put(roomSaveSucceeded(room))
    yield put(pushToast({ kind: 'success', title: id ? `Аудитория ${room.name} обновлена` : `Аудитория ${room.name} добавлена` }))
    yield put(catalogRequested())
    yield put(searchRequested())
  } catch (error) {
    const { fields, general } =
      isApiError(error) && error.status === 400 ? fieldErrors(error.details) : { fields: {}, general: [] }
    yield put(roomSaveFailed({ message: errorMessage(error), fields, general }))
    if (!isApiError(error) || error.status !== 400) yield call(reportError, error, 'Не удалось сохранить аудиторию')
  }
}

function* deleteRoom(action: PayloadAction<number>): SagaIterator {
  const room: Room | undefined = yield select((s: RootState) => s.rooms.catalog.find((r) => r.id === action.payload))
  try {
    yield call(gateway.adminDeleteRoom, action.payload)
    yield put(pushToast({ kind: 'success', title: `Аудитория ${room?.name ?? ''} удалена` }))
    yield put(catalogRequested())
    yield put(searchRequested())
  } catch (error) {
    yield call(reportError, error, 'Не удалось удалить аудиторию')
  } finally {
    yield put(roomDeleteFinished())
  }
}

function* loadStats(): SagaIterator {
  try {
    const items: Booking[] = yield call(gateway.adminGetBookings, { status: 'active' })
    yield put(statsSucceeded(items))
  } catch (error) {
    yield put(statsFailed())
    yield call(reportError, error, 'Не удалось загрузить статистику')
  }
}

export function* adminSaga(): SagaIterator {
  yield takeLatest(adminBookingsRequested.type, loadBookings)
  // Фильтры перезапрашиваем не сразу, а после паузы: пока выбирают период, уходит один запрос, а не несколько.
  yield debounce(FILTERS_DEBOUNCE_MS, [adminFiltersChanged.type, adminFiltersReset.type], refetchBookings)
  yield takeEvery(adminCancelRequested.type, cancelBooking)
  yield takeLeading(roomSaveRequested.type, saveRoom)
  yield takeLeading(roomDeleteRequested.type, deleteRoom)
  yield takeLatest(statsRequested.type, loadStats)
}
