import type { FormEvent } from 'react'
import type { TimeInterval } from '../../api/types'
import { fitsInFreeSlots, validateBookingTimes } from '../../api/bookingRules'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { bookingRequested, commentChanged, selectionChanged } from '../../redux/slices/slotsSlice'
import { GRID_BOUNDS, dayLabel, durationLabel, intervalMinutes, toMinutes } from '../../data/timeGrid'
import { Icon } from '../icons/Icon'

interface BookingPanelProps {
  roomName: string
  date: string
  freeSlots: TimeInterval[]
}

const COMMENT_MAX = 500

export const BookingPanel = ({ roomName, date, freeSlots }: BookingPanelProps) => {
  const dispatch = useAppDispatch()
  const { selection, comment, bookingStatus, conflict, conflictTick } = useAppSelector((s) => s.slots)
  const saving = bookingStatus === 'saving'

  const error = selection ? validateBookingTimes({ date, ...selection }) : null
  const busy = selection && !error && !fitsInFreeSlots(freeSlots, selection)
  const canSubmit = Boolean(selection) && !error && !busy && !saving

  const setStart = (startTime: string) => {
    const length = selection ? intervalMinutes(selection.startTime, selection.endTime) : 60
    const endMinutes = Math.min(toMinutes(startTime) + length, 18 * 60)
    const endTime = GRID_BOUNDS.find((t) => toMinutes(t) >= endMinutes) ?? '18:00'
    dispatch(selectionChanged({ startTime, endTime }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (canSubmit) dispatch(bookingRequested())
  }

  return (
    <form key={conflictTick} className={`booking-panel${conflict ? ' has-conflict' : ''}`} onSubmit={submit}>
      <div className="booking-panel__summary">
        <span className="booking-panel__label">Ваша бронь</span>
        {selection ? (
          <p className="booking-panel__value">
            {roomName}, {dayLabel(date).toLowerCase()}, <strong>{selection.startTime}–{selection.endTime}</strong>
            <span className="booking-panel__duration">{durationLabel(intervalMinutes(selection.startTime, selection.endTime))}</span>
          </p>
        ) : (
          <p className="booking-panel__value booking-panel__value--empty">Выберите время на шкале выше или в полях ниже</p>
        )}
      </div>

      <div className="booking-panel__times">
        <label className="field">
          <span className="field__label">Начало</span>
          <select className="select" value={selection?.startTime ?? ''} onChange={(e) => setStart(e.target.value)}>
            <option value="" disabled>
              —
            </option>
            {GRID_BOUNDS.slice(0, -1).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <span className="booking-panel__dash">–</span>
        <label className="field">
          <span className="field__label">Конец</span>
          <select
            className="select"
            value={selection?.endTime ?? ''}
            disabled={!selection}
            onChange={(e) => selection && dispatch(selectionChanged({ startTime: selection.startTime, endTime: e.target.value }))}
          >
            <option value="" disabled>
              —
            </option>
            {GRID_BOUNDS.filter((t) => !selection || toMinutes(t) > toMinutes(selection.startTime)).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field__label">
          Комментарий <span className="field__optional">необязательно</span>
          {comment.length > 0 && (
            <span className={`field__counter${comment.length >= COMMENT_MAX - 50 ? ' is-near' : ''}`}>
              {comment.length}/{COMMENT_MAX}
            </span>
          )}
        </span>
        <textarea
          className="textarea"
          rows={comment.length > 120 ? 4 : 2}
          maxLength={COMMENT_MAX}
          value={comment}
          placeholder="Например: подготовка к семинару"
          onChange={(e) => dispatch(commentChanged(e.target.value))}
        />
      </label>

      {error && <p className="form-hint form-hint--warn">{error}</p>}
      {busy && <p className="form-hint form-hint--warn">В выбранном интервале есть занятое время.</p>}
      {conflict && (
        <p className="form-error" role="alert">
          <Icon name="alert" size={16} />
          Пока вы выбирали, {conflict.startTime}–{conflict.endTime} забронировали. Выберите другое время.
        </p>
      )}

      <button type="submit" className="button button--primary button--block" disabled={!canSubmit}>
        {saving ? 'Бронируем…' : 'Забронировать'}
      </button>
    </form>
  )
}
