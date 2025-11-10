export const SENEGAL = {
  center: { lat: 14.7167, lng: -17.4677 },
  defaultZoom: 11,
  phoneRegex: /^\+221(70|76|77|78)\d{7}$/,
  currency: 'XOF',
  currencyLabel: 'FCFA'
};

export const API_BASE =
  (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_BASE) ||
  'http://localhost:4000';