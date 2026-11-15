import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import auth from './slices/authSlice'
import rooms from './slices/roomsSlice'
import slots from './slices/slotsSlice'
import bookings from './slices/bookingsSlice'
import admin from './slices/adminSlice'
import ui from './slices/uiSlice'
import { rootSaga } from './saga/saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: { auth, rooms, slots, bookings, admin, ui },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
