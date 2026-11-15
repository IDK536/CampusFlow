import { useEffect, useState, type FormEvent } from 'react'
import type { Building, Equipment, Room, RoomInput } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { roomSaveRequested, roomSaveReset } from '../../redux/slices/adminSlice'
import { EQUIPMENT } from '../../data/equipment'
import { BuildingSelect } from '../ui/BuildingSelect'
import { Modal } from '../ui/Modal'
import { Icon } from '../icons/Icon'

interface RoomFormModalProps {
  open: boolean
  room: Room | null
  existingNames: string[]
  onClose: () => void
}

interface FormState {
  name: string
  building: Building
  floor: string
  capacity: string
  equipment: Equipment[]
}

const toForm = (room: Room | null): FormState => ({
  name: room?.name ?? '',
  building: room?.building ?? 'A',
  floor: room ? String(room.floor) : '1',
  capacity: room ? String(room.capacity) : '',
  equipment: room?.equipment ?? [],
})

/** Те же правила, что у backend (раздел 3.10 раздатки), — чтобы ошибки было видно до отправки. */
const validate = (form: FormState, existingNames: string[], ownName?: string): Record<string, string> => {
  const errors: Record<string, string> = {}
  const name = form.name.trim()
  if (!name) errors.name = 'Укажите название'
  else if (
    name.toLowerCase() !== ownName?.toLowerCase() &&
    existingNames.some((n) => n.toLowerCase() === name.toLowerCase())
  ) {
    errors.name = 'Аудитория с таким названием уже есть'
  }
  const floor = Number(form.floor)
  if (!Number.isInteger(floor) || floor < 1) errors.floor = 'Целое число от 1'
  const capacity = Number(form.capacity)
  if (!Number.isInteger(capacity) || capacity <= 0) errors.capacity = 'Целое число больше 0'
  return errors
}

export const RoomFormModal = ({ open, room, existingNames, onClose }: RoomFormModalProps) => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((s) => s.admin.roomSave.status)

  useEffect(() => {
    if (open) dispatch(roomSaveReset())
  }, [open, dispatch])

  useEffect(() => {
    if (status === 'saved' && open) onClose()
  }, [status, open, onClose])

  return (
    <Modal
      open={open}
      title={room ? `Аудитория ${room.name}` : 'Новая аудитория'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" form="room-form" className="button button--primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Сохраняем…' : room ? 'Сохранить' : 'Добавить'}
          </button>
        </>
      }
    >
      {/* Форма монтируется заново при каждом открытии — состояние берётся из room без эффектов. */}
      <RoomForm room={room} existingNames={existingNames} />
    </Modal>
  )
}

const RoomForm = ({ room, existingNames }: { room: Room | null; existingNames: string[] }) => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((s) => s.admin.roomSave.error)
  const [form, setForm] = useState<FormState>(() => toForm(room))
  const [touched, setTouched] = useState(false)

  const localErrors = validate(form, existingNames, room?.name)
  const errors: Record<string, string | undefined> = { ...(touched ? localErrors : {}), ...(error?.fields ?? {}) }
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(localErrors).length) return
    const input: RoomInput = {
      name: form.name.trim(),
      building: form.building,
      floor: Number(form.floor),
      capacity: Number(form.capacity),
      equipment: form.equipment,
    }
    dispatch(roomSaveRequested({ id: room?.id ?? null, input }))
  }

  return (
    <form id="room-form" className="room-form" onSubmit={submit} noValidate>
      <label className={`field${errors.name ? ' has-error' : ''}`}>
        <span className="field__label">Название</span>
        <input
          className="input"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder={`${form.building}-${form.floor || 1}01`}
        />
        {errors.name && <span className="field__error">{errors.name}</span>}
      </label>

      <div className={`field${errors.building ? ' has-error' : ''}`}>
        <span className="field__label">Корпус</span>
        <BuildingSelect<Building> value={form.building} onChange={(building) => set({ building })} />
        {errors.building && <span className="field__error">{errors.building}</span>}
      </div>

      <div className="room-form__row">
        <label className={`field${errors.floor ? ' has-error' : ''}`}>
          <span className="field__label">Этаж</span>
          <input
            className="input"
            type="number"
            min={1}
            value={form.floor}
            onChange={(e) => set({ floor: e.target.value })}
          />
          {errors.floor && <span className="field__error">{errors.floor}</span>}
        </label>
        <label className={`field${errors.capacity ? ' has-error' : ''}`}>
          <span className="field__label">Вместимость</span>
          <input
            className="input"
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => set({ capacity: e.target.value })}
            placeholder="30"
          />
          {errors.capacity && <span className="field__error">{errors.capacity}</span>}
        </label>
      </div>

      <div className={`field${errors.equipment ? ' has-error' : ''}`}>
        <span className="field__label">Оборудование</span>
        <div className="chip-row">
          {EQUIPMENT.map((e) => {
            const active = form.equipment.includes(e.key)
            return (
              <button
                key={e.key}
                type="button"
                className={`chip${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() =>
                  set({ equipment: active ? form.equipment.filter((x) => x !== e.key) : [...form.equipment, e.key] })
                }
              >
                <Icon name={e.key} size={16} />
                {e.label}
              </button>
            )
          })}
        </div>
        {errors.equipment && <span className="field__error">{errors.equipment}</span>}
      </div>

      {error && (error.general.length > 0 || !Object.keys(error.fields).length) && (
        <p className="form-error" role="alert">
          <Icon name="alert" size={16} />
          {error.general.length ? error.general.join('. ') : error.message}
        </p>
      )}
    </form>
  )
}
