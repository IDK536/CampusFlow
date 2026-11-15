import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects'
import { eventChannel, type EventChannel, type SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gateway } from '../../api/gateway'
import type { LoginResponse } from '../../api/types'
import { clearSession, onSessionEvent, refreshSession, setSession, type Session, type SessionEvent } from '../../api/session'
import {
  loggedOut,
  loginFailed,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  restoreFinished,
  sessionExpired,
  sessionRefreshed,
} from '../slices/authSlice'
import { pushToast } from '../slices/uiSlice'
import { errorMessage } from './errors'
import type { RootState } from '../store'

function* login(action: PayloadAction<{ login: string; password: string }>): SagaIterator {
  try {
    const response: LoginResponse = yield call(gateway.login, action.payload.login, action.payload.password)
    setSession(response)
    yield put(loginSucceeded(response))
  } catch (error) {
    yield put(loginFailed(errorMessage(error)))
  }
}

/** Выход: отзываем refresh-сессию на сервере; локально выходим в любом случае. */
function* logout(): SagaIterator {
  try {
    yield call(gateway.logout)
  } catch {
    /* сервер недоступен — cookie истечёт сама, локальную сессию всё равно сбрасываем */
  }
  clearSession()
  yield put(loggedOut())
}

/** Идемпотентно: несколько одновременных 401 дают один выход и один тост. */
function* expire(): SagaIterator {
  const hasUser: boolean = yield select((s: RootState) => Boolean(s.auth.user))
  clearSession()
  if (!hasUser) return
  yield put(loggedOut())
  yield put(pushToast({ kind: 'info', title: 'Сессия истекла', message: 'Войдите снова, чтобы продолжить' }))
}

/** При старте вкладки восстанавливаем вход по refresh-cookie; нет cookie — просто экран входа. */
function* restore(): SagaIterator {
  try {
    const session: Session = yield call(refreshSession)
    yield put(loginSucceeded(session))
  } catch {
    clearSession()
    yield put(restoreFinished())
  }
}

/** События session.ts → Redux: новый access после refresh или окончательная потеря сессии. */
function* watchSessionEvents(): SagaIterator {
  const channel: EventChannel<SessionEvent> = eventChannel((emit) => onSessionEvent(emit))
  while (true) {
    const event: SessionEvent = yield take(channel)
    if (event.type === 'refreshed') {
      const restoring: boolean = yield select((s: RootState) => s.auth.restoring)
      if (!restoring) yield put(sessionRefreshed(event.session))
    } else {
      yield put(sessionExpired())
    }
  }
}

export function* authSaga(): SagaIterator {
  yield takeLatest(loginRequested.type, login)
  yield takeLatest(logoutRequested.type, logout)
  yield takeLatest(sessionExpired.type, expire)
  yield fork(watchSessionEvents)
  yield call(restore)
}
