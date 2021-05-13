import {put, select, takeLatest} from 'redux-saga/effects';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import actions from 'rdx/rootActions';

import type {
  UserSigninBegin,
  UserSignupBegin,
  PutUserProfileBegin,
} from './actions';

type GetResponse = FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
type PostResponse = FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;

const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const getUserProfile = () => select((state: ReduxState) => state.user.profile);

function* userSignInSaga(action: UserSigninBegin) {
  const {type, payload} = action;
  try {
    const {email, password} = payload;
    const resp: GetResponse = yield firestore()
      .collection('Users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get();
    if (!resp.size) throw new Error('Invalid username or password');
    yield put(actions.userSigninSuccess(resp.docs[0].data() as UserProfile));
  } catch (e) {
    yield put(actions.interactionError(type, e.message));
  }
}

function* userSignUpSaga(action: UserSignupBegin) {
  const {type, payload} = action;
  try {
    if (!isValidEmail(payload.email)) throw new Error('Invalid email format');
    const exist: GetResponse = yield firestore()
      .collection('Users')
      .where('email', '==', payload.email)
      .get();
    if (exist.size) throw new Error('Email is already used');
    yield firestore().collection('Users').doc(payload.email).set(payload);
    yield put(actions.userSignupSuccess(payload));
  } catch (e) {
    yield put(actions.interactionError(type, e.message));
  }
}

function* updateProfileSaga(action: PutUserProfileBegin) {
  const {type, payload} = action;
  try {
    const userProfile: UserProfile = yield getUserProfile();
    yield firestore()
      .collection('Users')
      .doc(userProfile.email)
      .update({...payload});
    yield put(actions.putUserProfileSuccess(payload));
  } catch (e) {
    yield put(actions.interactionError(type, e.message));
  }
}

export default [
  takeLatest(actions.userSigninBegin.type, userSignInSaga),
  takeLatest(actions.userSignupBegin.type, userSignUpSaga),
  takeLatest(actions.putUserProfileBegin.type, updateProfileSaga),
];
