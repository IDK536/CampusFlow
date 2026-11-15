import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import { loadThemePreference, type ThemePreference } from '../../data/theme'

export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  kind: ToastKind
  title: string
  message?: string
  code?: string
}

interface UiState {
  toasts: Toast[]
  theme: ThemePreference
}

const initialState: UiState = { toasts: [], theme: loadThemePreference() }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        // Одинаковые сообщения подряд не дублируем — просто обновляем.
        state.toasts = state.toasts.filter((t) => !(t.title === action.payload.title && t.message === action.payload.message))
        state.toasts.push(action.payload)
        if (state.toasts.length > 4) state.toasts.shift()
      },
      prepare(toast: Omit<Toast, 'id'>) {
        return { payload: { ...toast, id: nanoid() } }
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    themeChanged(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload
    },
  },
})

export const { pushToast, dismissToast, themeChanged } = uiSlice.actions
export default uiSlice.reducer
