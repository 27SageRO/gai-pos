import AsyncStorage from '@react-native-async-storage/async-storage';
import persistReducer from 'redux-persist/es/persistReducer';
import {combineReducers} from 'redux';

import interactions from 'rdx/interactions/reducer';
import user from 'rdx/user/reducer';
import products from 'rdx/products/reducer';
import transactions from 'rdx/transactions/reducer';

const combinedReducers: any = combineReducers({
  interactions,
  transactions: persistReducer(
    {key: 'transactions', storage: AsyncStorage},
    transactions,
  ),
  user: persistReducer({key: 'user', storage: AsyncStorage}, user),
  products: persistReducer({key: 'products', storage: AsyncStorage}, products),
});

export default combinedReducers;
