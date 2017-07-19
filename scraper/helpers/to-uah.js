'use strict';
const rates = require('./exchange-rates').rates;
module.exports = function toUAH(sum, currency) {
  if (sum === '' || typeof sum === 'undefined') {
    return 0;
  }
  sum = parseFloat(sum.replace(',', '.'));
  if (currency === 'грн' || currency === 'грн.' || currency === 'UAH' || currency === '' || typeof currency === 'undefined') {
    return sum;
  } else if (currency === 'OTHER') {

    // Карбованці
    return 0;
  } else if (rates[currency]) {
    return sum * rates[currency];
  }
  console.log(`${currency} is missing`);
};
