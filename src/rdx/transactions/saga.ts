import {put, select, takeLatest} from 'redux-saga/effects';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import actions from 'rdx/rootActions';

type GetResponse = FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
type PostResponse = FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;

const getUserProfile = () => select((state: ReduxState) => state.user.profile);

const postReceiptSaga = takeLatest(
  actions.postReceiptBegin,
  function* (action) {
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
  },
);

export default [postReceiptSaga];
