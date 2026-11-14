import { call, delay, put, race, select, take, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gateway } from '../../api/gateway'
import type { LoginResponse } from '../../api/types'
import { clearSession, saveSession } from '../../api/session'
import { tokenExpiresAt } from '../../api/jwt'
import {
  loggedOut,
  loginFailed,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  sessionExpired,
} from '../slices/authSlice'
import { pushToast } from '../slices/uiSlice'
import { errorMessage } from './errors'
import type { RootState } from '../store'

function* login(action: PayloadAction<{ login: string; password: string }>): SagaIterator {
  try {
    const response: LoginResponse = yield call(gateway.login, action.payload.login, action.payload.password)
    saveSession(response)
    yield put(loginSucceeded(response))
  } catch (error) {
    yield put(loginFailed(errorMessage(error)))
  }
}

function* logout(): SagaIterator {
  clearSession()
  yield put(loggedOut())
}

function* expire(): SagaIterator {
  clearSession()
  yield put(loggedOut())
  yield put(pushToast({ kind: 'info', title: 'Сессия истекла', message: 'Войдите снова, чтобы продолжить' }))
}

/** JWT-бонус: если в токене есть exp, сессия завершается ровно в момент истечения. */
function* watchTokenExpiry(): SagaIterator {
  while (true) {
    const token: string | null = yield select((s: RootState) => s.auth.token)
    const expiresAt = token ? tokenExpiresAt(token) : null
    if (expiresAt === null) {
      yield take([loginSucceeded.type, loggedOut.type])
      continue
    }
    const result: { timeout?: true } = yield race({
      timeout: delay(Math.max(0, expiresAt - Date.now())),
      changed: take([loginSucceeded.type, loggedOut.type]),
    })
    if (result.timeout) {
      yield put(sessionExpired())
      yield take(loggedOut.type)
    }
  }
}

export function* authSaga(): SagaIterator {
  yield takeLatest(loginRequested.type, login)
  yield takeLatest(logoutRequested.type, logout)
  yield takeLatest(sessionExpired.type, expire)
  yield call(watchTokenExpiry)
}
