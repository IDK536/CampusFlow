import type { Gateway } from './types'
import { httpGateway } from './httpGateway'
import { mockGateway } from './mockGateway'

export type * from './types'

/** VITE_USE_MOCK=false — работа с реальным backend через /api; иначе — mock-бэкенд в браузере. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const gateway: Gateway = USE_MOCK ? mockGateway : httpGateway

export const resetDemoData = (): void => {
  if (USE_MOCK) mockGateway.resetDemoData()
}

// В mock-режиме шлюз доступен из консоли — для демонстрации сценария 6 (403 на чужую бронь).
if (USE_MOCK && typeof window !== 'undefined') {
  ;(window as unknown as { campusflow: Gateway }).campusflow = gateway
}
