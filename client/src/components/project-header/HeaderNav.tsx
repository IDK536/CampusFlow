import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from '../icons/Icon'

const MOBILE_QUERY = '(max-width: 720px)'

export interface HeaderLink {
  to: string
  label: string
  short: string
  icon: IconName
  end?: boolean
}

/**
 * Навигация: если все разделы помещаются в шапку — они в шапке; если нет — нижняя панель вкладок,
 * как в мобильных приложениях. Ширины меряем по невидимой копии, пересчёт — при изменении размера.
 */
export const HeaderNav = ({ links }: { links: HeaderLink[] }) => {
  const navRef = useRef<HTMLElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(links.length)

  useLayoutEffect(() => {
    const nav = navRef.current
    const measure = measureRef.current
    if (!nav || !measure) return
    const update = () => {
      const available = nav.clientWidth
      const widths = [...measure.children].map((el) => (el as HTMLElement).offsetWidth)
      const total = widths.reduce((sum, w) => sum + w, 0)
      setFit(total <= available ? widths.length : 0)
    }
    const observer = new ResizeObserver(() => requestAnimationFrame(update))
    observer.observe(nav)
    // Ширины меняются, когда догружается шрифт.
    document.fonts?.ready.then(() => requestAnimationFrame(update))
    return () => observer.disconnect()
  }, [links])

  // На телефоне нижняя панель нужна всегда, даже если разделы влезают в шапку.
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setMobile(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const compact = mobile || fit < links.length

  useEffect(() => {
    document.body.classList.toggle('has-tab-bar', compact)
    return () => document.body.classList.remove('has-tab-bar')
  }, [compact])
  const linkClass = ({ isActive }: { isActive: boolean }) => `project-header__link${isActive ? ' is-active' : ''}`

  return (
    <nav className="project-header__nav" aria-label="Основная навигация" ref={navRef}>
      <div className="project-header__measure" ref={measureRef} aria-hidden="true">
        {links.map((l) => (
          <span key={l.to} className="project-header__link">
            {l.label}
          </span>
        ))}
      </div>

      {!compact &&
        links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
            {l.label}
          </NavLink>
        ))}

      {compact && (
        <div className="tab-bar" role="navigation" aria-label="Разделы">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} title={l.label}
              aria-label={l.label}
              className={({ isActive }) => `tab-bar__item${isActive ? ' is-active' : ''}`}>
              <Icon name={l.icon} size={20} />
              <span>{l.short}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
