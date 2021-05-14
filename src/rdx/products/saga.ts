import {put, select, takeLatest} from 'redux-saga/effects';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import actions from 'rdx/rootActions';

type GetResponse = FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
type PostResponse = FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;

const getUserProfile = () => select((state: ReduxState) => state.user.profile);
const getProducts = () =>
  select((state: ReduxState) => state.products.products);

const getProductsSaga = takeLatest(
  actions.getProductsBegin,
  function* (action) {
    const {type} = action;
    try {
      const userProfile: UserProfile = yield getUserProfile();
      const resp: GetResponse = yield firestore()
        .collection('Products')
        .where('userEmail', '==', userProfile.email)
        .get();
      yield put(
        actions.getProductsSuccess(
          resp.docs.map((o) => ({...o.data(), firebaseId: o.id})) as Product[],
        ),
      );
    } catch (e) {
      yield put(actions.interactionError(type, e.message));
    }
  },
);

const postProductSaga = takeLatest(
  actions.postProductBegin,
  function* (action) {
    const {type, payload} = action;
    try {
      const userProfile: UserProfile = yield getUserProfile();
      const exist: GetResponse = yield firestore()
        .collection('Products')
        .where('barcode', '==', payload.barcode)
        .where('barcodeType', '==', payload.barcodeType)
        .where('userEmail', '==', userProfile.email)
        .get();
      if (exist.size) throw new Error('The barcode is already in use');
      const resp: PostResponse = yield firestore()
        .collection('Products')
        .add({...payload, userEmail: userProfile.email});
      yield put(actions.postProductSuccess({...payload, firebaseId: resp.id}));
    } catch (e) {
      yield put(actions.interactionError(type, e.message));
    }
  },
);

const delProductSaga = takeLatest(actions.delProductBegin, function* (action) {
  const {type, payload} = action;
  try {
    const {id} = payload;
    const products: Products = yield getProducts();
    const product = products[id];
    yield firestore().collection('Products').doc(product.firebaseId).delete();
    yield put(actions.delProductSuccess(id));
  } catch (e) {
    yield put(actions.interactionError(type, e.message));
  }
});

export default [getProductsSaga, postProductSaga, delProductSaga];
