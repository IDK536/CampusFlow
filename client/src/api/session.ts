import type { User } from './types'
import { readJSON, sessionStore, writeJSON } from './storage'
import { isTokenExpired } from './jwt'

/**
 * Сессия живёт в sessionStorage: у каждой вкладки свой пользователь.
 * Так на демо можно открыть student1 и student2 в двух вкладках и показать конфликт 409.
 */
export interface Session {
  token: string
  user: User
}

const KEY = 'campusflow.session'

export const saveSession = (session: Session): void => writeJSON(sessionStore, KEY, session)

export const loadSession = (): Session | null => {
  const session = readJSON<Session>(sessionStore, KEY)
  if (!session?.token || !session.user) return null
  if (isTokenExpired(session.token)) {
    clearSession()
    return null
  }
  return session
}

export const clearSession = (): void => sessionStore.removeItem(KEY)
