import interactions from 'rdx/interactions/actions';
import user from 'rdx/user/actions';
import products from 'rdx/products/actions';
import transactions from 'rdx/transactions/actions';

export default {
  ...interactions,
  ...user,
  ...transactions,
  ...products,
};
