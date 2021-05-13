type TransactionsState = {
  cart: Cart;
  receipts: Receipts;
};

type Cart = Array<CartItem>;
type CartItem = {
  quantity: number;
  productId: string;
  productFirebaseId: string;
};

type Receipts = {[firebaseId: string]: Receipt};
type Receipt = {
  cart: Cart;
  products: Products;
  amountDue: string;
  cash: string;
  change: string;
  vatableSales: string;
  vatAmount: string;
  orNumber: string;
  date: string;
};
