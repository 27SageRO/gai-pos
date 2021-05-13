import {createAction} from 'rdx/toolkit';

const getProductsBegin = createAction('get/products/begin');
const getProductsSuccess = createAction<Product[]>('get/products/success');

const postProductBegin = createAction<Product>('post/product/begin');
const postProductSuccess = createAction<Product>('post/product/begin');

const delProductBegin = createAction('del/product/begin', (id: string) => ({
  payload: {id},
}));
const delProductSuccess = createAction('del/product/success', (id: string) => ({
  payload: {id},
}));

export type GetProductsBegin = ReturnType<typeof getProductsBegin>;
export type GetProductsSuccess = ReturnType<typeof getProductsSuccess>;
export type PostProductBegin = ReturnType<typeof postProductBegin>;
export type PostProductSuccess = ReturnType<typeof postProductSuccess>;
export type DelProductBegin = ReturnType<typeof delProductBegin>;
export type DelProductSuccess = ReturnType<typeof delProductSuccess>;

export default {
  getProductsBegin,
  getProductsSuccess,
  postProductBegin,
  postProductSuccess,
  delProductBegin,
  delProductSuccess,
};
