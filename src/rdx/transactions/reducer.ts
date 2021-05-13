import update from 'immutability-helper';
import actions from 'rdx/rootActions';
import {createReducer} from 'rdx/toolkit';

const initialState: TransactionsState = {
  cart: [],
  receipts: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(actions.cartAdd, (state, action) => {
      const {payload} = action;
      return update(state, {cart: {$push: [payload]}});
    })
    ?.addCase(actions.cartDel, (state, action) => {
      const index = action.payload;
      return update(state, {cart: {$splice: [[index, 1]]}});
    })
    ?.addCase(actions.postReceiptSuccess, (state, action) => {
      const {firebaseId, receipt} = action.payload;
      return update(state, {
        receipts: {[firebaseId]: {$set: receipt}},
        cart: {$set: []},
      });
    })
    ?.addCase(actions.delProductSuccess, (state) => {
      return update(state, {cart: {$set: []}});
    })
    ?.addCase(actions.userLogout, () => {
      return initialState;
    });
});
