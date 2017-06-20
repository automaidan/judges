const _ = require("lodash");
const fetch = require("./fetch-json");
const dataSource = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";
const rates = {};

module.exports.getter = function getter() {
    return fetch(dataSource)
        .then(currencies => {
            _.forEach(currencies, currency => {
                rates[currency.cc] = currency.rate;
            })
        });
};
module.exports.rates = rates;
