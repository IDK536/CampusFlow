import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { loginRequested } from '../../redux/slices/authSlice'
import { DEMO_USERS, ROLE_LABEL, initials } from '../../data/demoUsers'
import { Icon } from '../icons/Icon'

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const { status, error, pendingLogin } = useAppSelector((s) => s.auth)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const loading = status === 'loading'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!login.trim() || !password) return
    dispatch(loginRequested({ login: login.trim(), password }))
  }

  return (
    <div className="login-form">
      <h1 className="login-form__title">Вход</h1>

      <form className="login-form__form" onSubmit={submit} noValidate>
        <label className="field">
          <span className="field__label">Логин</span>
          <input
            className="input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            placeholder="student1"
            autoFocus
          />
        </label>
        <label className="field">
          <span className="field__label">Пароль</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={16} />
            {error}
          </p>
        )}
        <button type="submit" className="button button--primary button--block" disabled={loading || !login || !password}>
          {loading && pendingLogin === login.trim() ? 'Входим…' : 'Войти'}
        </button>
      </form>

      <div className="login-form__demo">
        <div className="login-form__demo-list">
          {DEMO_USERS.map((u) => (
            <button
              key={u.login}
              type="button"
              className="demo-user"
              disabled={loading}
              onClick={() => dispatch(loginRequested({ login: u.login, password: u.login }))}
            >
              <span className={`avatar avatar--${u.role}`}>{initials(u.displayName)}</span>
              <span className="demo-user__text">
                <span className="demo-user__name">
                  {u.displayName}
                  <span className="demo-user__login">{u.login}</span>
                </span>
                <span className="demo-user__hint">
                  {ROLE_LABEL[u.role]}
                </span>
              </span>
              <span className="demo-user__go">
                {pendingLogin === u.login ? '…' : <Icon name="arrowRight" size={18} />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
