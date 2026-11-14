import type { AdminBookingFilters } from './types'

/** Попадает ли дата (ГГГГ-ММ-ДД) в период фильтра. Пустые границы не ограничивают. */
export const inPeriod = (date: string, { dateFrom, dateTo }: Pick<AdminBookingFilters, 'dateFrom' | 'dateTo'>) =>
  (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo)
