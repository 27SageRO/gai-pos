import {all} from 'redux-saga/effects';

import user from 'rdx/user/saga';
import products from 'rdx/products/saga';
import transactions from 'rdx/transactions/saga';

export default function* rootSaga() {
  yield all([...user, ...products, ...transactions]);
}
