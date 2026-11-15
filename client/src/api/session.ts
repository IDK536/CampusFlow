import type { LoginResponse, User } from './types'
import { tokenExpiresAt } from './jwt'
import { isApiError } from './api'

/**
 * Сессия вкладки. Access-токен и пользователь живут только в памяти: в sessionStorage/localStorage
 * ничего не пишем. После перезагрузки вход восстанавливается через POST /api/auth/refresh
 * по HttpOnly refresh-cookie, которую JavaScript не видит.
 */
export interface Session {
  token: string
  user: User
}

export type SessionEvent = { type: 'refreshed'; session: Session } | { type: 'lost' }

let current: Session | null = null
let refreshing: Promise<Session> | null = null
let refresher: (() => Promise<LoginResponse>) | null = null
const listeners = new Set<(event: SessionEvent) => void>()

/** За сколько до истечения access обновляем его заранее, перед запросом. */
const REFRESH_AHEAD_MS = 30_000

export const getSession = (): Session | null => current
export const getAccessToken = (): string | null => current?.token ?? null

export const setSession = (session: Session): void => {
  current = { token: session.token, user: session.user }
}

export const clearSession = (): void => {
  current = null
}

export const onSessionEvent = (listener: (event: SessionEvent) => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const emit = (event: SessionEvent) => listeners.forEach((l) => l(event))

/** Шлюз сообщает, как вызвать refresh: так модуль не зависит от mock/HTTP-реализации. */
export const setRefresher = (fn: () => Promise<LoginResponse>): void => {
  refresher = fn
}

/**
 * Один refresh на вкладку: параллельные вызовы ждут общий Promise. Повтор уже использованного
 * refresh отзывает сессию на сервере, поэтому второй параллельный запрос недопустим.
 * 401/403 самого refresh завершают вход; сетевая ошибка — нет (сессию можно восстановить позже).
 */
export const refreshSession = (): Promise<Session> => {
  if (!refresher) return Promise.reject(new Error('refresh не настроен'))
  if (!refreshing) {
    const run = refresher
    refreshing = (async () => {
      try {
        const response = await run()
        setSession(response)
        emit({ type: 'refreshed', session: current! })
        return current!
      } catch (error) {
        if (isApiError(error) && (error.status === 401 || error.status === 403)) {
          const hadSession = current !== null
          clearSession()
          if (hadSession) emit({ type: 'lost' })
        }
        throw error
      } finally {
        refreshing = null
      }
    })()
  }
  return refreshing
}

/** Access истекает в ближайшие REFRESH_AHEAD_MS (токены без exp считаются бессрочными). */
export const accessExpiresSoon = (now = Date.now()): boolean => {
  const token = current?.token
  if (!token) return false
  const expiresAt = tokenExpiresAt(token)
  return expiresAt !== null && expiresAt - REFRESH_AHEAD_MS <= now
}
