const _ = require('lodash');

module.exports = function toSafestNumber(string) {
  return _.chain(string)
    .replace(',', '.')
    .thru(s => parseFloat(s))
    .thru((s) => {
      if (!_.isNaN(s)) {
        return _.round(s, 2);
      }
      return undefined;
    })
    .value();
};
