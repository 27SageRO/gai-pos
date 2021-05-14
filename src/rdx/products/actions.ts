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

export default {
  getProductsBegin,
  getProductsSuccess,
  postProductBegin,
  postProductSuccess,
  delProductBegin,
  delProductSuccess,
};
