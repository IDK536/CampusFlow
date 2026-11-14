import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../api/types'
import { loadSession, type Session } from '../../api/session'

type Status = 'idle' | 'loading' | 'failed'

interface AuthState {
  user: User | null
  token: string | null
  status: Status
  error: string | null
  /** Логин, под которым идёт вход прямо сейчас — для индикатора на кнопке быстрого входа. */
  pendingLogin: string | null
}

const restored = loadSession()

const initialState: AuthState = {
  user: restored?.user ?? null,
  token: restored?.token ?? null,
  status: 'idle',
  error: null,
  pendingLogin: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested(state, action: PayloadAction<{ login: string; password: string }>) {
      state.status = 'loading'
      state.error = null
      state.pendingLogin = action.payload.login
    },
    loginSucceeded(state, action: PayloadAction<Session>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'idle'
      state.pendingLogin = null
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
      state.pendingLogin = null
    },
    logoutRequested() {},
    loggedOut(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    sessionExpired() {},
  },
})

export const { loginRequested, loginSucceeded, loginFailed, logoutRequested, loggedOut, sessionExpired } =
  authSlice.actions
export default authSlice.reducer
