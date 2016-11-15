module.exports = function toUAH(sum, currency) {
    if (sum === "") {
        return 0;
    }
    sum = parseFloat(sum.replace(",", "."));
    if (currency === "грн" || currency === "UAH" || currency === "") {
        return sum;
    } else if (currency === "OTHER") {

        // Карбованці
        return 0;
    } else if (currency === "USD") {
        return sum * 25;
    } else if (currency === "EUR") {
        return sum * 28;
    }
};
