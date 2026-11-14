import { localStore } from '../api/storage'

/**
 * Темы оформления. «Как в системе» выбирает светлую или тёмную по prefers-color-scheme.
 * Выбор хранится в localStorage — это удобство конкретного браузера, а не данные пользователя.
 */
export type ThemePreference = 'light' | 'dark' | 'amoled' | 'system'
export type ResolvedTheme = 'light' | 'dark' | 'amoled'

export const THEME_KEY = 'campusflow.theme'
const PREFERENCES: ThemePreference[] = ['light', 'dark', 'amoled', 'system']

export const THEME_OPTIONS: { value: ThemePreference; label: string; hint: string }[] = [
  { value: 'light', label: 'Светлая', hint: 'Светлая тема' },
  { value: 'dark', label: 'Тёмная', hint: 'Тёмная тема' },
  { value: 'amoled', label: 'AMOLED', hint: 'Чёрная тема для OLED-экранов' },
  { value: 'system', label: 'Авто', hint: 'Как в настройках системы' },
]

// Цвет панели браузера на телефоне — под шапку каждой темы.
const META_COLOR: Record<ResolvedTheme, string> = { light: '#4329e0', dark: '#2b1aa6', amoled: '#000000' }

const darkQuery = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null)

export const loadThemePreference = (): ThemePreference => {
  try {
    const value = localStore.getItem(THEME_KEY) as ThemePreference | null
    return value && PREFERENCES.includes(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export const saveThemePreference = (preference: ThemePreference): void => {
  try {
    localStore.setItem(THEME_KEY, preference)
  } catch {
    /* без сохранения тема просто не запомнится */
  }
}

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? (darkQuery()?.matches ? 'dark' : 'light') : preference

export const applyTheme = (preference: ThemePreference): void => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const theme = resolveTheme(preference)
  if (root.dataset.theme === theme) return
  root.classList.add('theme-switching')
  root.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme])
  // Два кадра: стили применились без анимаций, после этого переходы снова включены.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
}

/** Подписка на смену системной темы; возвращает функцию отписки. */
export const onSystemThemeChange = (listener: () => void): (() => void) => {
  const query = darkQuery()
  if (!query) return () => {}
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
