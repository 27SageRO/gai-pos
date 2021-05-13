import update from 'immutability-helper';
import {createReducer} from 'rdx/toolkit';
import actions from './actions';

const initialState: UserState = {};

export default createReducer<UserState>(initialState, (builder) => {
  builder
    .addCase(actions.userSignupSuccess, (state, action) => {
      const {payload} = action;
      return update(state, {profile: {$set: payload}});
    })
    ?.addCase(actions.userSigninSuccess, (state, action) => {
      const {payload} = action;
      return update(state, {profile: {$set: payload}});
    })
    ?.addCase(actions.putUserProfileSuccess, (state, action) => {
      const {payload} = action;
      return update(state, {profile: {$merge: payload}});
    })
    ?.addCase(actions.userLogout, () => {
      return initialState;
    });
});
