import {createAction} from 'rdx/toolkit';

// Cart actions
const cartAdd = createAction<CartItem>('cart/add');
const cartDel = createAction<number>('cart/del');

// Receipt actions
const postReceiptBegin = createAction<Receipt>('post/receipt/begin');
const postReceiptSuccess = createAction(
  'post/receipt/success',
  (firebaseId: string, receipt: Receipt) => ({payload: {firebaseId, receipt}}),
);

export default {
  cartAdd,
  cartDel,
  postReceiptBegin,
  postReceiptSuccess,
};
