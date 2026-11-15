import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Booking, BookingStatus } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  adminBookingsRequested,
  adminCancelRequested,
  adminFiltersChanged,
  adminFiltersReset,
  defaultAdminFilters,
} from '../../redux/slices/adminSlice'
import { catalogRequested } from '../../redux/slices/roomsSlice'
import { pushToast } from '../../redux/slices/uiSlice'
import { isValidISODate, addDaysISO, dayLabel, formatDateShort, todayISO } from '../../data/timeGrid'
import { bookingsToCsv, downloadText } from '../../data/csv'
import { AdminBookingsTable } from '../../components/admin/AdminBookingsTable'
import { Segmented } from '../../components/ui/Segmented'
import { Skeleton } from '../../components/ui/Loader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Icon } from '../../components/icons/Icon'

const byTime = (a: Booking, b: Booking) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime) || a.id - b.id

type Preset = 'all' | 'today' | 'tomorrow' | 'week' | 'custom'

/** Быстрые периоды: «неделя» — сегодня и ещё шесть дней вперёд. */
const presetRange = (preset: Exclude<Preset, 'custom'>, today: string): [string, string] => {
  if (preset === 'today') return [today, today]
  if (preset === 'tomorrow') return [addDaysISO(today, 1), addDaysISO(today, 1)]
  if (preset === 'week') return [today, addDaysISO(today, 6)]
  return ['', '']
}

const PRESETS: Exclude<Preset, 'custom'>[] = ['all', 'today', 'tomorrow', 'week']

const periodLabel = (from: string, to: string): string => {
  if (from && from === to) return dayLabel(from).toLowerCase()
  if (from && to) return `${formatDateShort(from)} — ${formatDateShort(to)}`
  if (from) return `с ${formatDateShort(from)}`
  if (to) return `по ${formatDateShort(to)}`
  return 'за всё время'
}

export const AdminBookingsPage = () => {
  const dispatch = useAppDispatch()
  const [params] = useSearchParams()
  const { bookings, bookingsStatus, filters, cancellingIds } = useAppSelector((s) => s.admin)
  const catalog = useAppSelector((s) => s.rooms.catalog)
  const [toCancel, setToCancel] = useState<Booking | null>(null)
  const [layout, setLayout] = useState<'table' | 'cards'>('table')
  const today = todayISO()

  useEffect(() => {
    dispatch(catalogRequested())
    const date = params.get('date')
    if (date && isValidISODate(date)) dispatch(adminFiltersChanged({ dateFrom: date, dateTo: date }))
    else dispatch(adminBookingsRequested())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Список пользователей — из загруженных броней: фильтры сужают его так же, как и таблицу.
  const users = useMemo(
    () => [...new Map(bookings.map((b) => [b.userId, b.userDisplayName])).entries()].sort((a, b) => a[1].localeCompare(b[1])),
    [bookings],
  )
  const sorted = useMemo(() => [...bookings].sort(byTime), [bookings])
  const activeCount = bookings.filter((b) => b.status === 'active').length
  const dateFrom = filters.dateFrom ?? ''
  const dateTo = filters.dateTo ?? ''
  const preset: Preset =
    PRESETS.find((p) => {
      const [from, to] = presetRange(p, today)
      return from === dateFrom && to === dateTo
    }) ?? 'custom'
  const defaults = defaultAdminFilters()
  const hasFilters =
    dateFrom !== defaults.dateFrom || dateTo !== defaults.dateTo || Boolean(filters.roomId || filters.userId || filters.status)

  const setPeriod = (from: string, to: string) => dispatch(adminFiltersChanged({ dateFrom: from, dateTo: to }))
  // Начало позже конца — подтягиваем вторую границу, чтобы период не стал пустым.
  const changeFrom = (from: string) => setPeriod(from, from && dateTo && dateTo < from ? from : dateTo)
  const changeTo = (to: string) => setPeriod(to && dateFrom && dateFrom > to ? to : dateFrom, to)

  const exportCsv = () => {
    downloadText(`campusflow-bookings-${today}.csv`, bookingsToCsv(sorted, catalog))
    dispatch(pushToast({ kind: 'success', title: 'CSV выгружен', message: `${sorted.length} строк, открывается в Excel` }))
  }

  return (
    <div className="admin-page">
      <div className="container container--wide">
        <div className="page-head">
          <div>
            <h1 className="page-head__title">Все брони</h1>
          </div>
          <button type="button" className="button button--secondary" onClick={exportCsv} disabled={!sorted.length}>
            <Icon name="download" />
            Экспорт CSV
          </button>
        </div>

        <section className="toolbar" aria-label="Фильтры броней">
          <div className="toolbar__group">
            <span className="toolbar__label">Период</span>
            <div className="toolbar__inline">
              <Segmented<Preset>
                label="Быстрый выбор периода"
                size="sm"
                value={preset}
                onChange={(p) => p !== 'custom' && setPeriod(...presetRange(p, today))}
                options={[
                  { value: 'all', label: 'Все' },
                  { value: 'today', label: 'Сегодня' },
                  { value: 'tomorrow', label: 'Завтра' },
                  { value: 'week', label: 'Неделя', title: 'Сегодня и 6 дней вперёд' },
                ]}
              />
              <div className="period-range">
                <input
                  className="input input--date"
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => changeFrom(e.target.value)}
                  aria-label="Начало периода"
                />
                <span className="period-range__dash" aria-hidden="true">
                  —
                </span>
                <input
                  className="input input--date"
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => changeTo(e.target.value)}
                  aria-label="Конец периода"
                />
              </div>
            </div>
          </div>

          <label className="toolbar__group">
            <span className="toolbar__label">Аудитория</span>
            <select
              className="select"
              value={filters.roomId ?? ''}
              onChange={(e) => dispatch(adminFiltersChanged({ roomId: e.target.value ? Number(e.target.value) : '' }))}
            >
              <option value="">Все</option>
              {[...catalog]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="toolbar__group">
            <span className="toolbar__label">Пользователь</span>
            <select
              className="select"
              value={filters.userId ?? ''}
              onChange={(e) => dispatch(adminFiltersChanged({ userId: e.target.value ? Number(e.target.value) : '' }))}
            >
              <option value="">Все</option>
              {users.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <div className="toolbar__group">
            <span className="toolbar__label">Статус</span>
            <Segmented<BookingStatus | ''>
              label="Статус"
              size="sm"
              value={filters.status ?? ''}
              onChange={(status) => dispatch(adminFiltersChanged({ status }))}
              options={[
                { value: '', label: 'Все' },
                { value: 'active', label: 'Активные' },
                { value: 'cancelled', label: 'Отменённые' },
              ]}
            />
          </div>

          {hasFilters && (
            <button type="button" className="link-button toolbar__reset" onClick={() => dispatch(adminFiltersReset())}>
              Сбросить
            </button>
          )}
        </section>

        <div className="results-head">
          <p className="results-head__count">
            Найдено <strong>{bookings.length}</strong>, из них активных — {activeCount}
            {' · '}
            {periodLabel(dateFrom, dateTo)}
          </p>
          <Segmented<'table' | 'cards'>
            label="Вид списка"
            size="sm"
            value={layout}
            onChange={setLayout}
            options={[
              { value: 'table', label: 'Таблица' },
              { value: 'cards', label: 'Карточки' },
            ]}
          />
        </div>

        {bookingsStatus === 'loading' && bookings.length === 0 ? (
          <Skeleton rows={5} height={52} />
        ) : sorted.length === 0 ? (
          <EmptyState icon="list" title="Броней не найдено">
            {filters.roomId || filters.userId || filters.status
              ? 'Попробуйте убрать часть фильтров.'
              : dateFrom || dateTo
                ? `Броней ${periodLabel(dateFrom, dateTo)} нет. Выберите другой период.`
                : 'Пока никто ничего не забронировал.'}
          </EmptyState>
        ) : (
          // Пока идёт перезапрос — старый список остаётся, но приглушён: без мигания скелетоном.
          <div className={`admin-results${bookingsStatus === 'loading' ? ' is-loading' : ''}`} aria-busy={bookingsStatus === 'loading'}>
            <AdminBookingsTable bookings={sorted} cancellingIds={cancellingIds} onCancel={setToCancel} cards={layout === 'cards'} />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(toCancel)}
        title={`Отменить бронь №${toCancel?.id ?? ''}?`}
        confirmLabel="Отменить бронь"
        cancelLabel="Оставить"
        danger
        onConfirm={() => {
          if (toCancel) dispatch(adminCancelRequested(toCancel.id))
          setToCancel(null)
        }}
        onClose={() => setToCancel(null)}
      >
        {toCancel && (
          <p>
            {toCancel.roomName}, {dayLabel(toCancel.date).toLowerCase()}, {toCancel.startTime}–{toCancel.endTime}.
            <br />
            Бронь пользователя <strong>{toCancel.userDisplayName}</strong> будет отменена, время освободится.
          </p>
        )}
      </ConfirmDialog>
    </div>
  )
}
