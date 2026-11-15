import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { loginRequested, logoutRequested } from '../../redux/slices/authSlice'
import { pushToast } from '../../redux/slices/uiSlice'
import { searchRequested } from '../../redux/slices/roomsSlice'
import { DEMO_USERS, ROLE_LABEL, initials } from '../../data/demoUsers'
import { USE_MOCK, resetDemoData } from '../../api/gateway'
import { Icon } from '../icons/Icon'
import { ThemeSwitcher } from '../ui/ThemeSwitcher'
import { HeaderNav, type HeaderLink } from './HeaderNav'

const STUDENT_LINKS: HeaderLink[] = [
  { to: '/', label: 'Аудитории', short: 'Аудитории', icon: 'door', end: true },
  { to: '/my-bookings', label: 'Мои брони', short: 'Мои брони', icon: 'calendarCheck' },
]

const ADMIN_LINKS: HeaderLink[] = [
  { to: '/', label: 'Аудитории', short: 'Аудитории', icon: 'door', end: true },
  { to: '/admin/bookings', label: 'Все брони', short: 'Брони', icon: 'calendarList' },
  { to: '/admin/rooms', label: 'Справочник', short: 'Каталог', icon: 'building' },
  { to: '/admin/stats', label: 'Аналитика', short: 'Аналитика', icon: 'bars' },
  { to: '/my-bookings', label: 'Мои брони', short: 'Мои', icon: 'calendarCheck' },
]

export const ProjectHeader = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const pendingLogin = useAppSelector((s) => s.auth.pendingLogin)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenuOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  if (!user) return null
  const links = user.role === 'admin' ? ADMIN_LINKS : STUDENT_LINKS

  const switchTo = (login: string) => {
    setMenuOpen(false)
    dispatch(loginRequested({ login, password: login }))
  }

  const reset = () => {
    setMenuOpen(false)
    resetDemoData()
    dispatch(searchRequested())
    dispatch(pushToast({ kind: 'info', title: 'Демо-данные сброшены', message: 'Аудитории и брони вернулись к seed-набору' }))
  }

  return (
    <header className="project-header">
      <div className="container project-header__inner">
        <Link to="/" className="project-header__logo" aria-label="CampusFlow — на главную">
          <span className="project-header__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          CampusFlow
        </Link>

        <HeaderNav links={links} />

        <div className="project-header__user" ref={menuRef}>
          <button
            type="button"
            className="project-header__user-button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className={`avatar avatar--${user.role}`}>{initials(user.displayName)}</span>
            <span className="project-header__user-text">
              <span className="project-header__user-name">{user.displayName}</span>
              <span className="project-header__user-role">{ROLE_LABEL[user.role]}</span>
            </span>
            <Icon name="chevronDown" size={16} />
          </button>

          {menuOpen && (
            <div className="user-menu" role="menu">
              <p className="user-menu__caption">Войти как</p>
              {DEMO_USERS.filter((u) => u.login !== user.login).map((u) => (
                <button key={u.login} type="button" role="menuitem" className="user-menu__item" onClick={() => switchTo(u.login)}>
                  <span className={`avatar avatar--sm avatar--${u.role}`}>{initials(u.displayName)}</span>
                  <span>
                    <span className="user-menu__name">{u.displayName}</span>
                    <span className="user-menu__hint">
                      {u.login} · {ROLE_LABEL[u.role].toLowerCase()}
                    </span>
                  </span>
                  {pendingLogin === u.login && <span className="user-menu__pending">…</span>}
                </button>
              ))}
              <div className="user-menu__divider" />
              <p className="user-menu__caption">Тема</p>
              <div className="user-menu__theme">
                <ThemeSwitcher />
              </div>
              <div className="user-menu__divider" />
              {USE_MOCK && (
                <button type="button" role="menuitem" className="user-menu__item user-menu__item--plain" onClick={reset}>
                  <Icon name="refresh" />
                  Сбросить демо-данные
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                className="user-menu__item user-menu__item--plain"
                onClick={() => dispatch(logoutRequested())}
              >
                <Icon name="logout" />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
