import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'
import { LoginForm } from '../../components/auth/LoginForm'
import { ThemeSwitcher } from '../../components/ui/ThemeSwitcher'
import { Loader } from '../../components/ui/Loader'

export const LoginPage = () => {
  const user = useAppSelector((s) => s.auth.user)
  const restoring = useAppSelector((s) => s.auth.restoring)
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (user) return <Navigate to={from && from !== '/login' ? from : '/'} replace />
  if (restoring) return <Loader label="Восстанавливаем вход…" />

  return (
    <div className="login-page">
      <header className="project-header login-page__bar">
        <div className="container project-header__inner">
          <span className="project-header__logo">
            <span className="project-header__mark" aria-hidden="true">
              <span />
              <span />
            </span>
            CampusFlow
          </span>
          <div className="project-header__theme login-page__theme">
            <ThemeSwitcher compact />
          </div>
        </div>
      </header>
      <main className="login-page__form">
        <LoginForm />
      </main>
    </div>
  )
}
