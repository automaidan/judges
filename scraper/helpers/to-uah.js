const rates = require('./exchange-rates').rates;

module.exports = function toUAH(rawSum, currency) {
  if (rawSum === '' || typeof rawSum === 'undefined') {
    return 0;
  }
  const sum = typeof currency === 'string' ? parseFloat(rawSum.replace(',', '.')) : rawSum;
  if (['грн', 'грн.', 'UAH', ''].includes(currency) || typeof currency === 'undefined') {
    return sum;
  } else if (currency === 'OTHER') {
    // Карбованці
    return 0;
  } else if (rates[currency]) {
    return sum * rates[currency];
  }
  console.log(`${currency} is missing`);
  return undefined;
};
