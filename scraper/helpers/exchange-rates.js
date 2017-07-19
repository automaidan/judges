const _ = require('lodash');
const fetch = require('./fetch-json');
const moment = require('moment');
const dataSource = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json=true&date=${moment().add(-1, 'days').format('YYYYMMDD')}`;
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
