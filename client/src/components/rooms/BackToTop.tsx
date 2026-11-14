import { useEffect, useState } from 'react'
import { Icon } from '../icons/Icon'

/**
 * Плавающая стрелка «назад»: когда страница прокручена вниз (например, к расписанию под списком),
 * возвращает к выбранной аудитории в списке или на схеме, а если её нет — наверх страницы.
 */
const selectedCard = () => document.querySelector<HTMLElement>('.rooms-page__results [aria-pressed="true"].is-selected')

export const BackToTop = ({ hasSelection }: { hasSelection: boolean }) => {
  const [visible, setVisible] = useState(false)
  const [toCard, setToCard] = useState(false)

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 600)
      setToCard(hasSelection && selectedCard() !== null)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [hasSelection])

  const goBack = () => {
    const card = hasSelection ? selectedCard() : null
    const rect = card?.getBoundingClientRect()
    // Карточка уже на экране — значит, возвращаться к ней некуда, идём в начало страницы.
    if (card && rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      card.focus({ preventScroll: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      onClick={goBack}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title={toCard ? 'К выбранной аудитории' : 'Наверх'}
    >
      <Icon name="arrowUp" size={20} />
      <span className="back-to-top__label">{toCard ? 'К аудитории' : 'Наверх'}</span>
    </button>
  )
}
