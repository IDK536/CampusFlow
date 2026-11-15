import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  catalogRequested,
  filtersChanged,
  roomSelected,
  searchRequested,
  viewChanged,
  type RoomsView,
} from '../../redux/slices/roomsSlice'
import { selectionChanged, slotsCleared, slotsRequested } from '../../redux/slices/slotsSlice'
import type { Recommendation } from '../../data/recommend'
import { dayLabel, durationLabel, isPastDate, isValidISODate, nowMinutes, toMinutes, toTime, todayISO } from '../../data/timeGrid'
import { earliestWindow } from '../../data/recommend'
import { RoomFilters } from '../../components/rooms/RoomFilters'
import { CampusMap } from '../../components/rooms/CampusMap'
import { RoomList } from '../../components/rooms/RoomList'
import { RecommendBlock } from '../../components/rooms/RecommendBlock'
import { RoomSchedule } from '../../components/slots/RoomSchedule'
import { BookingTicket } from '../../components/slots/BookingTicket'
import { BackToTop } from '../../components/rooms/BackToTop'
import { Segmented } from '../../components/ui/Segmented'
import { Skeleton } from '../../components/ui/Loader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/icons/Icon'
import { roomsCount } from '../../data/plural'
import { hasBookableTime } from '../../data/availability'

const VIEW_OPTIONS = [
  { value: 'map' as const, label: (<><Icon name="map" size={16} /> Схема</>) },
  { value: 'list' as const, label: (<><Icon name="list" size={16} /> Список</>) },
  { value: 'pick' as const, label: (<><Icon name="target" size={16} /> Подбор</>) },
]

export const RoomsPage = () => {
  const dispatch = useAppDispatch()
  const [params, setParams] = useSearchParams()
  const user = useAppSelector((s) => s.auth.user)
  const { filters, results, status, catalog, catalogStatus, view, selectedRoomId } = useAppSelector((s) => s.rooms)
  const lastBooking = useAppSelector((s) => s.slots.lastBooking)
  const canBook = user?.role === 'student'
  const scheduleRef = useRef<HTMLDivElement>(null)

  // ?room=4&date=2025-11-12 — можно поделиться ссылкой или вернуться из «Моих броней».
  useEffect(() => {
    const date = params.get('date')
    const room = Number(params.get('room'))
    if (date && isValidISODate(date) && !isPastDate(date)) dispatch(filtersChanged({ date }))
    if (room) dispatch(roomSelected(room))
    // только при первом открытии страницы
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const next = new URLSearchParams()
    if (selectedRoomId) next.set('room', String(selectedRoomId))
    next.set('date', filters.date)
    setParams(next, { replace: true })
  }, [selectedRoomId, filters.date, setParams])

  useEffect(() => {
    dispatch(catalogRequested())
  }, [dispatch])

  // ?room=999 или удалённая аудитория: справочник загружен, а такой нет — снимаем выбор.
  useEffect(() => {
    if (catalogStatus === 'succeeded' && selectedRoomId && !catalog.some((r) => r.id === selectedRoomId)) {
      dispatch(roomSelected(null))
    }
  }, [dispatch, catalogStatus, catalog, selectedRoomId])

  useEffect(() => {
    dispatch(searchRequested())
  }, [dispatch, filters])

  useEffect(() => {
    if (selectedRoomId) dispatch(slotsRequested({ roomId: selectedRoomId, date: filters.date, keepSelection: true }))
    else dispatch(slotsCleared())
  }, [dispatch, selectedRoomId, filters.date])

  // Для подсветки на шкалах: точное время или промежуток, в котором ищем окно.
  const interval = filters.timeMode !== 'any' ? { startTime: filters.startTime, endTime: filters.endTime } : null
  const flexible = filters.timeMode === 'flexible'
  /** Что подставить в бронь при выборе аудитории: точное время или её первое окно нужной длины. */
  const intervalFor = (roomId: number) => {
    if (!flexible) return interval
    const room = results.find((r) => r.id === roomId)
    const notBefore = filters.date === todayISO() ? nowMinutes() : 0
    const found = room && earliestWindow(room.freeSlots, filters.durationMin, Math.max(toMinutes(filters.startTime), notBefore), toMinutes(filters.endTime))
    return found ? { startTime: toTime(found.start), endTime: toTime(found.end) } : null
  }
  const selectedRoom = useMemo(
    () => catalog.find((r) => r.id === selectedRoomId) ?? results.find((r) => r.id === selectedRoomId),
    [catalog, results, selectedRoomId],
  )

  const focusSchedule = () => {
    if (window.matchMedia('(max-width: 1100px)').matches) {
      setTimeout(() => scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  const selectRoom = (id: number) => {
    if (id === selectedRoomId) return focusSchedule()
    dispatch(roomSelected(id))
    if (canBook) dispatch(selectionChanged(intervalFor(id)))
    focusSchedule()
  }

  const chooseRecommendation = (rec: Recommendation) => {
    dispatch(roomSelected(rec.room.id))
    if (canBook) dispatch(selectionChanged(rec.interval))
    focusSchedule()
  }

  // По ТЗ ищут свободную аудиторию: занятые весь день (или с уже прошедшим свободным временем) прячем.
  const [showFull, setShowFull] = useState(false)
  const bookable = useMemo(() => results.filter((r) => hasBookableTime(r.freeSlots, filters.date)), [results, filters.date])
  const hiddenCount = results.length - bookable.length
  const visible = showFull ? results : bookable

  const loading = status === 'loading' && results.length === 0

  return (
    <div className="rooms-page">
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-head__title">Аудитории</h1>
          </div>
          <Segmented<RoomsView> label="Вид" value={view} onChange={(v) => dispatch(viewChanged(v))} options={VIEW_OPTIONS} />
        </div>

        {view !== 'pick' && <RoomFilters />}

        <div className={`rooms-page__layout${selectedRoom ? ' has-schedule' : ''}`}>
          <section className="rooms-page__results" aria-live="polite">
            {view === 'pick' ? (
              <RecommendBlock onChoose={chooseRecommendation} canBook={canBook} />
            ) : (
              <>
                <div className="results-head">
                  <p className="results-head__count">
                    {status === 'loading' ? (
                      'Ищем…'
                    ) : (
                      <>
                        <strong>{visible.length}</strong> {roomsCount(visible.length).replace(/^\d+ /, '')} на {dayLabel(filters.date).toLowerCase()}
                        {interval && (
                          <>
                            {flexible
                              ? `, есть ${durationLabel(filters.durationMin)} в ${interval.startTime}–${interval.endTime}`
                              : `, свободны ${interval.startTime}–${interval.endTime}`}
                          </>
                        )}
                      </>
                    )}
                  </p>
                  {status !== 'loading' && hiddenCount > 0 && (
                    <button type="button" className="link-button" onClick={() => setShowFull((v) => !v)}>
                      {showFull ? 'Скрыть занятые' : `Показать занятые весь день (${hiddenCount})`}
                    </button>
                  )}
                </div>
                {loading ? (
                  <Skeleton rows={view === 'map' ? 2 : 4} height={view === 'map' ? 180 : 110} />
                ) : status === 'failed' ? (
                  <EmptyState icon="alert" title="Не удалось загрузить аудитории">
                    Проверьте подключение и попробуйте ещё раз.
                  </EmptyState>
                ) : view === 'map' ? (
                  <CampusMap
                    catalog={catalog}
                    results={visible}
                    building={filters.building}
                    selectedId={selectedRoomId}
                    interval={interval}
                    onSelect={selectRoom}
                    onPickBuilding={(building) => dispatch(filtersChanged({ building }))}
                  />
                ) : visible.length === 0 ? (
                  <EmptyState icon="building" title="Под эти условия ничего не нашлось">
                    Уберите часть оборудования, уменьшите число мест или выберите другое время.
                  </EmptyState>
                ) : (
                  <RoomList rooms={visible} selectedId={selectedRoomId} interval={interval} onSelect={selectRoom} />
                )}
              </>
            )}
          </section>

          <div className="rooms-page__schedule" ref={scheduleRef}>
            {selectedRoom ? (
              <RoomSchedule room={selectedRoom} date={filters.date} canBook={canBook} />
            ) : (
              <div className="schedule-placeholder">
                <span className="schedule-placeholder__shape" aria-hidden="true" />
                <p className="schedule-placeholder__title">Выберите аудиторию</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BackToTop hasSelection={Boolean(selectedRoom)} />
      <BookingTicket booking={lastBooking} room={catalog.find((r) => r.id === lastBooking?.roomId)} />
    </div>
  )
}
