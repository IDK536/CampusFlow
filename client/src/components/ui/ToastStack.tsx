import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { dismissToast, type Toast } from '../../redux/slices/uiSlice'
import { Icon } from '../icons/Icon'

const ICON = { success: 'check', error: 'alert', info: 'info' } as const

const ToastItem = ({ toast }: { toast: Toast }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), toast.kind === 'error' ? 7000 : 4500)
    return () => clearTimeout(timer)
  }, [dispatch, toast.id, toast.kind])

  return (
    <div className={`toast toast--${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'}>
      <span className="toast__icon">
        <Icon name={ICON[toast.kind]} size={18} />
      </span>
      <div className="toast__content">
        <p className="toast__title">{toast.title}</p>
        {toast.message && <p className="toast__message">{toast.message}</p>}
      </div>
      <button type="button" className="toast__close" onClick={() => dispatch(dismissToast(toast.id))} aria-label="Скрыть">
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}

export const ToastStack = () => {
  const toasts = useAppSelector((s) => s.ui.toasts)
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
