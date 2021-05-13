import {put, select, takeLatest} from 'redux-saga/effects';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import actions from 'rdx/rootActions';

import type {PostReceiptBegin} from './actions';

type GetResponse = FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
type PostResponse = FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;

const getUserProfile = () => select((state: ReduxState) => state.user.profile);

function* postReceiptSaga(action: PostReceiptBegin) {
  const {type, payload} = action;
  try {
    const userProfile: UserProfile = yield getUserProfile();
    const resp: PostResponse = yield firestore()
      .collection('Receipts')
      .add({
        ...payload,
        userEmail: userProfile.email,
      });
    yield put(actions.postReceiptSuccess(resp.id, payload));
  } catch (e) {
    yield put(actions.interactionError(type, e.message));
  }
}

export default [takeLatest(actions.postReceiptBegin.type, postReceiptSaga)];
