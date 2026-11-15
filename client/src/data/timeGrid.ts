/** Рабочий день и сетка времени из раздаточного материала: 09:00–18:00, шаг 30 минут. */
export const DAY_START = 9 * 60
export const DAY_END = 18 * 60
export const STEP = 30

export const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const pad = (n: number) => String(n).padStart(2, '0')

export const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export const toTime = (minutes: number): string => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

/** Начала всех ячеек сетки: 09:00, 09:30 … 17:30. */
export const GRID_STARTS: number[] = Array.from(
  { length: (DAY_END - DAY_START) / STEP },
  (_, i) => DAY_START + i * STEP,
)

/** Все допустимые границы интервала: 09:00 … 18:00. */
export const GRID_BOUNDS: string[] = Array.from(
  { length: (DAY_END - DAY_START) / STEP + 1 },
  (_, i) => toTime(DAY_START + i * STEP),
)

export const toISODate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const todayISO = (): string => toISODate(new Date())

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDaysISO = (iso: string, days: number): string => {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export const isValidISODate = (iso: string): boolean =>
  DATE_RE.test(iso) && toISODate(parseISODate(iso)) === iso

export const isPastDate = (iso: string, today = todayISO()): boolean => iso < today

export const nowMinutes = (): number => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

const longFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
const shortFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })

export const formatDateLong = (iso: string): string => longFormatter.format(parseISODate(iso))
export const formatDateShort = (iso: string): string => shortFormatter.format(parseISODate(iso)).replace('.', '')
export const formatWeekday = (iso: string): string => weekdayFormatter.format(parseISODate(iso))
export const formatMonth = (iso: string): string => monthFormatter.format(parseISODate(iso)).replace('.', '')

export const relativeDayLabel = (iso: string, today = todayISO()): string | null => {
  if (iso === today) return 'Сегодня'
  if (iso === addDaysISO(today, 1)) return 'Завтра'
  if (iso === addDaysISO(today, 2)) return 'Послезавтра'
  return null
}

export const dayLabel = (iso: string): string => relativeDayLabel(iso) ?? formatDateLong(iso)

export const durationLabel = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} мин`
  return m ? `${h} ч ${m} мин` : `${h} ч`
}

export const intervalMinutes = (startTime: string, endTime: string): number => toMinutes(endTime) - toMinutes(startTime)
