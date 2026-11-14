import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../icons/Icon'

interface ModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md'
  /** Модалка без рамки и заголовка — для билета брони. */
  bare?: boolean
}

export const Modal = ({ open, title, onClose, children, footer, size = 'md', bare = false }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('is-modal-open')
    const firstField = dialogRef.current?.querySelector<HTMLElement>('input, select, textarea, button:not(.modal__close)')
    ;(firstField ?? dialogRef.current)?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-modal-open')
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={`modal__dialog modal__dialog--${size}${bare ? ' modal__dialog--bare' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {!bare && (
          <header className="modal__header">
            <h2 className="modal__title">{title}</h2>
            <button type="button" className="icon-button modal__close" onClick={onClose} aria-label="Закрыть">
              <Icon name="close" />
            </button>
          </header>
        )}
        <div className={bare ? undefined : 'modal__body'}>{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
