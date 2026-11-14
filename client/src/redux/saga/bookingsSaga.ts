import { call, put, select, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gateway } from '../../api/gateway'
import { isApiError } from '../../api/api'
import type { Booking, BookingStatus, TimeInterval } from '../../api/types'
import { dayLabel } from '../../data/timeGrid'
import {
  bookingFailed,
  bookingRequested,
  bookingSucceeded,
  conflictDetected,
  slotsRequested,
} from '../slices/slotsSlice'
import {
  cancelFailed,
  cancelRequested,
  cancelSucceeded,
  myBookingsFailed,
  myBookingsRequested,
  myBookingsSucceeded,
  statusFilterChanged,
} from '../slices/bookingsSlice'
import { searchRequested } from '../slices/roomsSlice'
import { pushToast } from '../slices/uiSlice'
import { errorMessage, reportError } from './errors'
import type { RootState } from '../store'

/** После любой мутации обновляем таймлайн выбранной аудитории и схему — слот «возвращается в сетку». */
function* refreshAvailability(): SagaIterator {
  const { roomId, date }: RootState['slots'] = yield select((s: RootState) => s.slots)
  if (roomId && date) yield put(slotsRequested({ roomId, date, keepSelection: true }))
  yield put(searchRequested())
}

const intervalFromDetails = (details: Record<string, unknown> | null): TimeInterval | null =>
  details && typeof details.startTime === 'string' && typeof details.endTime === 'string'
    ? { startTime: details.startTime, endTime: details.endTime }
    : null

function* createBooking(): SagaIterator {
  const { roomId, date, selection, comment }: RootState['slots'] = yield select((s: RootState) => s.slots)
  if (!roomId || !date || !selection) {
    yield put(bookingFailed())
    return
  }
  try {
    const booking: Booking = yield call(gateway.createBooking, { roomId, date, ...selection, comment: comment.trim() })
    yield put(bookingSucceeded(booking))
    yield call(refreshAvailability)
  } catch (error) {
    if (isApiError(error) && error.status === 409) {
      const busy = intervalFromDetails(error.details)
      yield put(conflictDetected(busy))
      yield put(
        pushToast({
          kind: 'error',
          title: 'Это время уже заняли',
          message: busy ? `${error.message}: ${busy.startTime}–${busy.endTime}` : error.message,
          code: error.code,
        }),
      )
      yield call(refreshAvailability)
      return
    }
    yield put(bookingFailed())
    yield call(reportError, error, 'Не удалось забронировать')
  }
}

function* loadMyBookings(): SagaIterator {
  const status: BookingStatus | '' = yield select((s: RootState) => s.bookings.statusFilter)
  try {
    const items: Booking[] = yield call(gateway.getMyBookings, status)
    yield put(myBookingsSucceeded(items))
  } catch (error) {
    yield put(myBookingsFailed(errorMessage(error)))
    yield call(reportError, error, 'Не удалось загрузить брони')
  }
}

function* cancelMyBooking(action: PayloadAction<number>): SagaIterator {
  const booking: Booking | undefined = yield select((s: RootState) =>
    s.bookings.items.find((b) => b.id === action.payload),
  )
  try {
    yield call(gateway.cancelBooking, action.payload)
    yield put(cancelSucceeded(action.payload))
    yield put(
      pushToast({
        kind: 'success',
        title: 'Бронь отменена',
        message: booking
          ? `${booking.roomName}, ${dayLabel(booking.date).toLowerCase()} ${booking.startTime}–${booking.endTime} снова свободна`
          : 'Слот снова свободен',
      }),
    )
    yield call(refreshAvailability)
  } catch (error) {
    yield put(cancelFailed(action.payload))
    yield call(reportError, error, 'Не удалось отменить бронь')
    if (isApiError(error) && error.code === 'ALREADY_CANCELLED') yield put(myBookingsRequested())
  }
}

export function* bookingsSaga(): SagaIterator {
  yield takeLeading(bookingRequested.type, createBooking)
  yield takeLatest([myBookingsRequested.type, statusFilterChanged.type], loadMyBookings)
  yield takeEvery(cancelRequested.type, cancelMyBooking)
}
