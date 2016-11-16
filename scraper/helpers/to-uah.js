"use strict";
module.exports = function toUAH(sum, currency) {
    if (sum === "") {
        return 0;
    }
    sum = parseFloat(sum.replace(",", "."));
    if (currency === "грн" || currency === "грн." || currency === "UAH" || currency === "") {
        return sum;
    } else if (currency === "OTHER") {

        // Карбованці
        return 0;
    } else if (currency === "USD") {
        return sum * 26.24;
    } else if (currency === "EUR") {
        return sum * 28.14;
    } else if (currency === "GBP") {
        return sum * 32.66;
    } else if (currency === "NOK") {
        return sum * 3.11;
    } else if (currency === "CHF") {
        return sum * 26.28;
    }
    console.log(`${currency} is missing`);
};
