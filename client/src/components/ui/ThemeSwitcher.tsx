import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { themeChanged } from '../../redux/slices/uiSlice'
import { THEME_OPTIONS, type ThemePreference } from '../../data/theme'
import { Icon, type IconName } from '../icons/Icon'

const ICONS: Record<ThemePreference, IconName> = {
  light: 'sun',
  dark: 'moon',
  amoled: 'amoled',
  system: 'monitor',
}

/**
 * Переключатель темы: «плитки» с иконкой и подписью в меню пользователя,
 * компактный вариант (только иконки) — на странице входа.
 */
export const ThemeSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const dispatch = useAppDispatch()
  const current = useAppSelector((s) => s.ui.theme)

  return (
    <div className={`theme-switcher${compact ? ' theme-switcher--compact' : ''}`} role="radiogroup" aria-label="Тема оформления">
      {THEME_OPTIONS.map((option) => {
        const active = option.value === current
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.hint}
            title={option.hint}
            className={`theme-switcher__item${active ? ' is-active' : ''}`}
            onClick={() => dispatch(themeChanged(option.value))}
          >
            <Icon name={ICONS[option.value]} size={compact ? 16 : 18} />
            {!compact && <span>{option.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
