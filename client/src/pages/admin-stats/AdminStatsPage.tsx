import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { statsRequested, adminFiltersChanged } from '../../redux/slices/adminSlice'
import { catalogRequested } from '../../redux/slices/roomsSlice'
import { TOP_ROOMS, buildLoadReport, formatPercent } from '../../data/stats'
import { BUILDINGS } from '../../data/equipment'
import { DAY_END, DAY_START, addDaysISO, durationLabel, formatDateShort, toTime, GRID_STARTS, todayISO } from '../../data/timeGrid'
import { LoadHeatmap } from '../../components/admin/LoadHeatmap'
import { HourBars } from '../../components/admin/HourBars'
import { Skeleton } from '../../components/ui/Loader'
import { Icon } from '../../components/icons/Icon'
import { bookingsCount } from '../../data/plural'

const PERIOD = 7

const hours = (minutes: number) => `${Math.round(minutes / 60).toLocaleString('ru-RU')} ч`

export const AdminStatsPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { bookings, status } = useAppSelector((s) => s.admin.stats)
  const catalog = useAppSelector((s) => s.rooms.catalog)
  const [from, setFrom] = useState(todayISO())

  useEffect(() => {
    dispatch(catalogRequested())
    dispatch(statsRequested())
  }, [dispatch])

  const dates = useMemo(() => Array.from({ length: PERIOD }, (_, i) => addDaysISO(from, i)), [from])
  const report = useMemo(() => buildLoadReport(bookings, catalog, dates), [bookings, catalog, dates])

  const byLoad = [...BUILDINGS].sort((a, b) => report.byBuilding[b].percent - report.byBuilding[a].percent)
  const busiestBuilding = byLoad[0]
  const peakIndex = report.byHalfHour.indexOf(Math.max(...report.byHalfHour))
  const busiestDay = [...dates].sort((a, b) => report.byDay[b].minutes - report.byDay[a].minutes)[0]
  const ready = status === 'succeeded' && catalog.length > 0
  const dayMax = Math.max(1, ...dates.map((d) => report.byDay[d].percent))
  const buildingMax = Math.max(1, ...BUILDINGS.map((b) => report.byBuilding[b].percent))
  // Сколько минут одна аудитория могла бы быть занята за период.
  const roomCapacity = (DAY_END - DAY_START) * PERIOD
  const topMinutes = Math.max(1, ...report.topRooms.map((r) => r.minutes))
  const busyBuildings = byLoad.filter((b) => report.byBuilding[b].minutes > 0)
  const idleBuildings = BUILDINGS.filter((b) => report.byBuilding[b].minutes === 0)

  const openDay = (date: string) => {
    dispatch(adminFiltersChanged({ dateFrom: date, dateTo: date, roomId: '', userId: '', status: '' }))
    navigate('/admin/bookings')
  }

  return (
    <div className="admin-page stats-page">
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-head__title">Аналитика</h1>
          </div>
          <div className="period-switch">
            <button type="button" className="icon-button" onClick={() => setFrom(addDaysISO(from, -PERIOD))} aria-label="Предыдущая неделя">
              <Icon name="arrowLeft" />
            </button>
            <span className="period-switch__label">
              {formatDateShort(dates[0])} — {formatDateShort(dates[dates.length - 1])}
            </span>
            <button type="button" className="icon-button" onClick={() => setFrom(addDaysISO(from, PERIOD))} aria-label="Следующая неделя">
              <Icon name="arrowRight" />
            </button>
            {from !== todayISO() && (
              <button type="button" className="link-button" onClick={() => setFrom(todayISO())}>
                С сегодня
              </button>
            )}
          </div>
        </div>

        {!ready ? (
          <Skeleton rows={3} height={140} />
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi kpi--violet">
                <span className="kpi__icon">
                  <Icon name="calendar" size={18} />
                </span>
                <span className="kpi__value">{report.totalBookings.toLocaleString('ru-RU')}</span>
                <span className="kpi__label">активных броней за неделю</span>
                <span className="kpi__note">≈ {Math.round(report.totalBookings / PERIOD).toLocaleString('ru-RU')} в день</span>
              </div>
              <div className="kpi">
                <span className="kpi__icon">
                  <Icon name="clock" size={18} />
                </span>
                <span className="kpi__value">{hours(report.totalMinutes)}</span>
                <span className="kpi__label">занятого времени</span>
                <span className="kpi__note">≈ {hours(report.totalMinutes / PERIOD)} в день</span>
              </div>
              <div className="kpi">
                <span className="kpi__icon">
                  <Icon name="chart" size={18} />
                </span>
                <span className="kpi__value">{formatPercent(report.averagePercent)}</span>
                <span className="kpi__label">средняя загрузка кампуса</span>
                <div className="kpi__spark" aria-label="Загрузка по дням">
                  {dates.map((date) => {
                    const day = report.byDay[date]
                    return (
                      <span
                        key={date}
                        className={`kpi__spark-bar${date === busiestDay && day.minutes > 0 ? ' is-max' : ''}`}
                        style={{ height: `${(day.percent / dayMax) * 100}%` }}
                        title={`${formatDateShort(date)}: ${formatPercent(day.percent)}`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="kpi kpi--lime">
                <span className="kpi__icon">
                  <Icon name="building" size={18} />
                </span>
                <span className="kpi__value">{report.totalBookings ? `Корпус ${busiestBuilding}` : '—'}</span>
                <span className="kpi__label">{report.totalBookings ? 'самый загруженный' : 'нет броней за неделю'}</span>
                {report.totalBookings > 0 && (
                  <span className="kpi__note">
                    {formatPercent(report.byBuilding[busiestBuilding].percent)} · {hours(report.byBuilding[busiestBuilding].minutes)} занято
                  </span>
                )}
              </div>
            </div>

            <section className="panel">
              <header className="panel__head">
                <h2 className="panel__title">По дням и корпусам</h2>
                <p className="panel__hint">Нажмите на день, чтобы открыть его брони</p>
              </header>
              <LoadHeatmap report={report} dates={dates} onDayClick={openDay} />
            </section>

            <div className="stats-page__columns">
              <div className="stats-page__stack">
                <section className="panel">
                  <header className="panel__head">
                    <h2 className="panel__title">Пиковые часы</h2>
                    {report.totalBookings > 0 && (
                      <p className="panel__hint">
                        Больше всего броней в {toTime(GRID_STARTS[peakIndex])}–{toTime(GRID_STARTS[peakIndex] + 30)}, самый
                        плотный день — {formatDateShort(busiestDay)}
                      </p>
                    )}
                  </header>
                  <HourBars values={report.byHalfHour} />
                </section>

                <section className="panel">
                  <header className="panel__head">
                    <h2 className="panel__title">Самые востребованные</h2>
                    <p className="panel__hint">Топ-{TOP_ROOMS} по занятому времени за неделю</p>
                  </header>
                  {report.topRooms.length === 0 ? (
                    <p className="panel__empty">В этом периоде броней нет.</p>
                  ) : (
                    <ol className="top-rooms">
                      {report.topRooms.map((r, i) => (
                        <li key={r.roomId} className="top-rooms__item">
                          <span className="top-rooms__rank">{i + 1}</span>
                          <span className="top-rooms__name">{r.name}</span>
                          <span className="top-rooms__bar">
                            {/* Полоса — относительно лидера, процент — от всего доступного времени аудитории. */}
                            <span style={{ width: `${(r.minutes / topMinutes) * 100}%` }} />
                          </span>
                          <span className="top-rooms__percent" title="Доля от 9 часов × 7 дней">
                            {formatPercent((r.minutes / roomCapacity) * 100)}
                          </span>
                          <span className="top-rooms__value">
                            {durationLabel(r.minutes)} · {bookingsCount(r.bookings)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              </div>

              <section className="panel">
                <header className="panel__head">
                  <h2 className="panel__title">По корпусам</h2>
                  <p className="panel__hint">Доля занятого времени за неделю</p>
                </header>
                {busyBuildings.length === 0 ? (
                  <p className="panel__empty">В этом периоде броней нет.</p>
                ) : (
                  <ul className="building-load">
                    {busyBuildings.map((b) => {
                      const item = report.byBuilding[b]
                      return (
                        <li key={b} className={`building-load__item${b === busiestBuilding ? ' is-top' : ''}`}>
                          <span className="building-load__letter">{b}</span>
                          <span className="building-load__name">
                            Корпус {b}
                            <span className="building-load__meta">
                              {item.rooms} ауд. · {hours(item.minutes)}
                            </span>
                          </span>
                          <span className="building-load__value">{formatPercent(item.percent)}</span>
                          <span className="building-load__track">
                            <span style={{ width: `${(item.percent / buildingMax) * 100}%` }} />
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
                {idleBuildings.length > 0 && busyBuildings.length > 0 && (
                  <p className="building-load__idle">Без броней: {idleBuildings.join(', ')}</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
