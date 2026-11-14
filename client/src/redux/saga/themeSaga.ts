import { eventChannel, type EventChannel, type SagaIterator } from 'redux-saga'
import { call, fork, select, take, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { applyTheme, onSystemThemeChange, saveThemePreference, type ThemePreference } from '../../data/theme'
import { themeChanged } from '../slices/uiSlice'
import type { RootState } from '../store'

function* changeTheme(action: PayloadAction<ThemePreference>): SagaIterator {
  saveThemePreference(action.payload)
  yield call(applyTheme, action.payload)
}

const systemThemeChannel = (): EventChannel<true> =>
  eventChannel((emit) => onSystemThemeChange(() => emit(true)))

/** В режиме «Авто» тема следует за системной без перезагрузки страницы. */
function* followSystemTheme(): SagaIterator {
  const channel: EventChannel<true> = yield call(systemThemeChannel)
  try {
    while (true) {
      yield take(channel)
      const preference: ThemePreference = yield select((s: RootState) => s.ui.theme)
      if (preference === 'system') yield call(applyTheme, preference)
    }
  } finally {
    channel.close()
  }
}

export function* themeSaga(): SagaIterator {
  const initial: ThemePreference = yield select((s: RootState) => s.ui.theme)
  yield call(applyTheme, initial)
  yield takeLatest(themeChanged.type, changeTheme)
  yield fork(followSystemTheme)
}
