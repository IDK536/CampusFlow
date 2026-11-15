import { put, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { isApiError } from '../../api/api'
import { pushToast } from '../slices/uiSlice'
import { sessionExpired } from '../slices/authSlice'
import type { RootState } from '../store'

export const errorMessage = (error: unknown): string => {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return 'Что-то пошло не так'
}

/**
 * Единая точка показа ошибок API: 401 (уже после неудачного refresh и повтора в gateway.ts)
 * завершает сессию, остальное — тост с текстом от backend.
 */
export function* reportError(error: unknown, title: string): SagaIterator {
  if (isApiError(error) && error.status === 401) {
    const hasUser: boolean = yield select((s: RootState) => Boolean(s.auth.user))
    if (hasUser) {
      yield put(sessionExpired())
      return
    }
  }
  yield put(
    pushToast({
      kind: 'error',
      title,
      message: errorMessage(error),
      code: isApiError(error) ? error.code : undefined,
    }),
  )
}
