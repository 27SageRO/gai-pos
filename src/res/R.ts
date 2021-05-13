const colors = {
  malibu: '#64D2FF',
  malibuFade: '#92e0ff',
  riverBed: '#424C58',
  cadetBlue: '#AFB7C2',
  aquaHaze: '#EEF2F5',
  mercury: '#E4E4E4',
  wildsand: '#F4F4F4',

  // crimson are for error messages
  crimson: '#EC2A3A',
  crimsonfade: '#f3959d',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// these fonts can be found in
// android/app/src/main/assets
const fonts = {
  regular: 'circe',
  bold: 'circe_bold',
  extrabold: 'circe_extrabold',
  extralight: 'circe_extralight',
  light: 'circe_light',
};

const getProductId = (product: Product) => {
  // Product id will look like:
  // EAN_13:4806518333588
  // a combination of barcode type and id
  return `${product.barcodeType}:${product.barcode}`;
};

const R = {
  colors,
  fonts,
  getProductId,
};

export default R;
