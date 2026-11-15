import { all, fork } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { authSaga } from './authSaga'
import { roomsSaga } from './roomsSaga'
import { bookingsSaga } from './bookingsSaga'
import { adminSaga } from './adminSaga'
import { themeSaga } from './themeSaga'

export function* rootSaga(): SagaIterator {
  yield all([fork(authSaga), fork(roomsSaga), fork(bookingsSaga), fork(adminSaga), fork(themeSaga)])
}
