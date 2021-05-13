type ProductState = {
  products: Products;
};

// ID is barCodeType:barCode
// example: EAN_13:4806518333588
type Products = {[id: string]: Product};
type Product = {
  sku: string;
  description: string;
  price: string;
  vat: string;
  srp: string;
  barcode: string;
  barcodeType: string;
  firebaseId?: string;
};
