import {createAction} from 'rdx/toolkit';

const userLogout = createAction('user/logout');

const userSignupBegin = createAction<UserProfile>('user/signup/begin');
const userSignupSuccess = createAction<UserProfile>('user/signup/success');

const userSigninBegin = createAction(
  'user/signin/begin',
  (email: string, password: string) => ({payload: {email, password}}),
);
const userSigninSuccess = createAction<UserProfile>('user/signin/success');

const putUserProfileBegin = createAction<
  Pick<UserProfile, 'cashierName' | 'vatRegTin'>
>('put/user/profile/begin');
const putUserProfileSuccess = createAction<
  Pick<UserProfile, 'cashierName' | 'vatRegTin'>
>('pust/user/profile/success');

export type UserLogout = ReturnType<typeof userLogout>;
export type UserSignupBegin = ReturnType<typeof userSignupBegin>;
export type UserSignupSuccess = ReturnType<typeof userSignupSuccess>;
export type UserSigninBegin = ReturnType<typeof userSigninBegin>;
export type UserSigninSuccess = ReturnType<typeof userSigninSuccess>;
export type PutUserProfileBegin = ReturnType<typeof putUserProfileBegin>;
export type PutUserProfileSuccess = ReturnType<typeof putUserProfileSuccess>;

export default {
  userLogout,
  userSignupBegin,
  userSignupSuccess,
  userSigninBegin,
  userSigninSuccess,
  putUserProfileBegin,
  putUserProfileSuccess,
};
