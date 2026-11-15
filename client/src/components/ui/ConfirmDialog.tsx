import type { ReactNode } from 'react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Не надо',
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    title={title}
    onClose={onClose}
    size="sm"
    footer={
      <>
        <button type="button" className="button button--ghost" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`button ${danger ? 'button--danger' : 'button--primary'}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Минутку…' : confirmLabel}
        </button>
      </>
    }
  >
    <div className="confirm-dialog__text">{children}</div>
  </Modal>
)
