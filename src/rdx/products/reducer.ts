import update from 'immutability-helper';
import actions from 'rdx/rootActions';
import {createReducer} from 'rdx/toolkit';
import R from 'res/R';

const initialState: ProductState = {
  products: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(actions.postProductSuccess, (state, action) => {
      const {payload} = action;
      const id = R.getProductId(payload);
      return update(state, {products: {[id]: {$set: payload}}});
    })
    ?.addCase(actions.getProductsSuccess, (state, action) => {
      const {payload} = action;
      const products: Products = {};
      payload.forEach((product) => {
        const id = R.getProductId(product);
        products[id] = product;
      });
      return update(state, {products: {$merge: products}});
    })
    ?.addCase(actions.delProductSuccess, (state, action) => {
      const {id} = action.payload;
      return update(state, {products: {$unset: [id]}});
    })
    ?.addCase(actions.userLogout, () => {
      return initialState;
    });
});
