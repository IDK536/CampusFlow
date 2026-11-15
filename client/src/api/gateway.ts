import type { Gateway } from './types'
import { httpGateway } from './httpGateway'
import { mockGateway } from './mockGateway'
import { isApiError } from './api'
import { accessExpiresSoon, getSession, refreshSession, setRefresher } from './session'

export type * from './types'

/**
 * VITE_USE_MOCK=false — работа с реальным backend через /api; иначе — mock-бэкенд в браузере.
 * Mock не проверяет совместимость с настоящим API: для интеграционной проверки задайте VITE_USE_MOCK=false.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const base: Gateway = USE_MOCK ? mockGateway : httpGateway

setRefresher(base.refresh)

/** Методы, которые не требуют действительного access и сами не запускают refresh. */
const AUTH_METHODS = new Set<keyof Gateway>(['login', 'refresh', 'logout'])

/**
 * Обёртка над шлюзом: перед запросом обновляет access, если он вот-вот истечёт, а на 401 —
 * один общий refresh и не более одного повтора. 401 самого refresh завершает вход
 * (событие 'lost' в session.ts). Пустой административный 404 refresh не запускает.
 */
const withSession = (g: Gateway): Gateway => {
  const wrapped = { ...g } as Record<keyof Gateway, unknown>
  for (const key of Object.keys(g) as (keyof Gateway)[]) {
    if (AUTH_METHODS.has(key)) continue
    const fn = g[key] as (...args: unknown[]) => Promise<unknown>
    wrapped[key] = async (...args: unknown[]) => {
      if (getSession() && accessExpiresSoon()) await refreshSession()
      try {
        return await fn(...args)
      } catch (error) {
        if (!(isApiError(error) && error.status === 401 && getSession())) throw error
        await refreshSession()
        return fn(...args)
      }
    }
  }
  return wrapped as unknown as Gateway
}

export const gateway: Gateway = withSession(base)

export const resetDemoData = (): void => {
  if (USE_MOCK) mockGateway.resetDemoData()
}

// В mock-режиме шлюз доступен из консоли — для демонстрации сценария 6 (403 на чужую бронь).
if (USE_MOCK && typeof window !== 'undefined') {
  ;(window as unknown as { campusflow: Gateway }).campusflow = gateway
}
