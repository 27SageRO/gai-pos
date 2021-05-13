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

export type CartAdd = ReturnType<typeof cartAdd>;
export type CartDel = ReturnType<typeof cartDel>;
export type PostReceiptBegin = ReturnType<typeof postReceiptBegin>;
export type PostReceiptSuccess = ReturnType<typeof postReceiptSuccess>;

export default {
  cartAdd,
  cartDel,
  postReceiptBegin,
  postReceiptSuccess,
};
